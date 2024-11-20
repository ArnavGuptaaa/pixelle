import { S3Client } from "@aws-sdk/client-s3";

const BUCKET_REGION = process.env.BUCKET_REGION;
const USER_ACCESS_KEY = process.env.USER_ACCESS_KEY;
const USER_SECRET_ACCESS_KEY = process.env.USER_SECRET_ACCESS_KEY;

const s3 = new S3Client({
	credentials: {
		accessKeyId: USER_ACCESS_KEY,
		secretAccessKey: USER_SECRET_ACCESS_KEY,
	},
	region: BUCKET_REGION,
});

export default s3;
