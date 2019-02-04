# Deploying backend to Heroku through Heroku CLI:

1. heroku login
2. git push heroku deploy:master

# Deploying frontend static files to AWS through s3cmd CLI:

(Install Homebrew if you haven't already)
1. brew install s3cmd
2. s3cmd --configure
3. Copy and paste the AWS access keys when prompted, as well as our bucket name (amp-freeassociations) in the format specified
4. s3cmd ls (our bucket should be listed)
5. s3cmd sync build/* s3://amp-freeassociations

# Deploying frontend static files to AWS through aws CLI (windows):

(Install scoop, or whatever installer you use, if you haven't already)
1. scoop install aws
2. aws configure. If have already configured aws before you may need to create a profile `aws configure --profile [PROFILE NAME]`
3. Copy and paste the AWS access keys when prompted, as well as our bucket name (amp-freeassociations) in the format specified
4. aws s3 ls (our bucket should be listed). If you created a profile `aws s3 ls --profile [PROFILE NAME}`
- If you get an error `while reading from .... in section 'default' already exists` then go to ~/.aws and open the configure file. Make sure the new profile your created is on a new line, save and retry.
5. aws s3 sync build s3://amp-freeassociations (or `s3 sync build s3://amp-freeassociations --profile [PROFILE NAME]`

## ^ These steps are for initial setup and update. For further deployments - 
1. npm run build
2. s3cmd sync build/* s3://amp-freeassociations or aws s3 sync build s3://amp-freeassociations

Link for reference: https://www.fullstackreact.com/articles/deploying-a-react-app-to-s3/
