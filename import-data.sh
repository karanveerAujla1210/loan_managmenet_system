#!/bin/bash
echo "Starting MongoDB import..."

mongoimport --db loancrm --collection users --file users.json
mongoimport --db loancrm --collection customers --file customers.json
mongoimport --db loancrm --collection loans --file loans.json
mongoimport --db loancrm --collection payments --file payments.json
mongoimport --db loancrm --collection disbursements --file disbursements.json

echo "Import completed!"
