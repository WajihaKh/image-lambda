# Image Lambda

## Author**: Wajiha Khan

## Version: 1.0.0

[AWS](https://wk-lambda.s3.us-east-2.amazonaws.com/images.json)

### How to Use Your Lambda Function

1. **Create an S3 Bucket**:
   - Go to the AWS S3 console.
   - Click "Create bucket".
   - Provide a unique name for your bucket.
   - Uncheck "Block all public access"
   - Click "Create bucket".

2. **Upload Initial Files**:
   - Navigate to your newly created S3 bucket.
   - Upload an empty file named `images.json`.
   - Create a folder named `images`.

3. **Set Bucket Policy**:
   - Go to the "Permissions" tab of your S3 bucket.
   - Click on "Bucket Policy" and add a policy to allow Lambda access.

4. **Create a Lambda Function**:
   - Go to the AWS Lambda console.
   - Click "Create function".
   - Choose "Author from scratch".
   - Choose the runtime (e.g., Node.js).
   - Create or choose an existing execution role with permissions to access S3.
   - Click "Create function".

5. **Link S3 Bucket to Lambda**:
   - Under "Triggers", click "Add trigger".
   - Choose "S3" as the trigger.
   - Choose the event type "All object create events".
   - Click "Add".

6. **Provide Event JSON**:
   - Use an appropriate JSON structure as a test event for your Lambda function. Ensure it matches the structure expected by the function, including the necessary S3 event information.

7. **Update Lambda Function Code**:
   - Ensure the Lambda function code correctly handles S3 events, reads and writes to the `images.json` file, and updates the file with new image metadata.

8. **Deploy and Test**:
   - Deploy the updated Lambda function.
   - Use the test event JSON to simulate an S3 event in the AWS Lambda console.
   - Ensure the test passes successfully.

9. **Upload an Image**:
   - Upload an image to the `images` folder in your S3 bucket.
   - This should trigger the Lambda function automatically.

10. **Check the `images.json` File**:
    - Go to your S3 bucket and check the `images.json` file.
    - Ensure it contains the updated array with the new image's name, size, and type.

11. **Verify the Tests**:
    - Verify that the Lambda function updates the `images.json` file correctly for each image upload.
    - Ensure all tests pass and the `images.json` file is accurate.

### Issues Encountered During Lambda Deployment

- Initial use of node-fetch caused module errors, resolved by handling streams directly with the AWS SDK.

- Incorrect test event structures caused failures. Ensuring correct S3 event structures resolved this.

- Insufficient permissions caused access errors. Adding correct policies to the Lambda execution role and S3 bucket resolved these issues.
