Deploying backend to Heroku through Heroku CLI:

1. heroku login
2. git push heroku deploy:master

Deploying frontend static files to AWS through s3cmd CLI:

(Install Homebrew if you haven't already)
1. brew install s3cmd
2. s3cmd --configure
3. Copy and paste the AWS access keys when prompted, as well as our bucket name (amp-freeassociations) in the format specified
4. s3cmd ls (our bucket should be listed)
5. s3cmd sync build/* s3://amp-freeassociations

^ These s3cmd steps are for initial setup and update. For further deployments - 
1. npm run build
2. s3cmd sync build/* s3://amp-freeassociations

Link for reference: https://www.fullstackreact.com/articles/deploying-a-react-app-to-s3/
