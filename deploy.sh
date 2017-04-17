git checkout heroku
git merge master
git add .
git commit -m "Deploying..."
git push heroku heroku:master
git checkout master 
echo "Deployed changes."
