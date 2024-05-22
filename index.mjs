import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));

  const s3Client = new S3Client({ region: 'us-east-2' });

  if (!event.Records || !event.Records[0] || !event.Records[0].s3) {
    console.error('Invalid event structure');
    return {
      statusCode: 400,
      body: 'Invalid event structure',
    };
  }

  const name = event.Records[0].s3.object.key;
  const size = event.Records[0].s3.object.size;
  const type = name.split('.').pop();
  const newImageDetails = { name, size, type };
  console.log('New image details:', newImageDetails);

  const input = {
    Bucket: 'wk-lambda',
    Key: 'images.json',
  };

  let imageDetails;

  try {
    const results = await s3Client.send(new GetObjectCommand(input));
    const jsonString = await streamToString(results.Body);
    const retrievedImageDetails = JSON.parse(jsonString);
    imageDetails = retrievedImageDetails;
  } catch (e) {
    console.log('Error getting images.json:', e);
    imageDetails = [];
  }

  const index = imageDetails.findIndex((img) => img.name === name);
  if (index !== -1) {
    imageDetails[index] = newImageDetails;
  } else {
    imageDetails.push(newImageDetails);
  }

  console.log('Updated image details array:', imageDetails);

  const stringifiedDetails = JSON.stringify(imageDetails, undefined, 2);
  const putInput = {
    ...input,
    Body: stringifiedDetails,
    ContentType: 'application/json', 
  };

  try {
    await s3Client.send(new PutObjectCommand(putInput));
  } catch (e) {
    console.warn('Failed to put images.json:', e);
  }

  const response = {
    statusCode: 200,
    body: stringifiedDetails,
  };
  return response;
};
