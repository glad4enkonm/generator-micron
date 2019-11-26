# Setup script, started from ./install folder (packed with makeself)

# import configuration file with env variables
if [[ -f $<%= packageUpperCase %>_PWD/configuration.txt ]]; then
  set -o allexport
  source $<%= packageUpperCase %>_PWD/configuration.txt
  set +o allexport
  echo configuration imported
fi

# Run DB migrations
password=`echo $<%= packageUpperCase %>_DB_PASSWORD | base64 --decode`
cd Database

# Replace db name in all scripts
cd Scripts
for ifile in *; do envsubst < $ifile > ../tmp && mv ../tmp $ifile; done
cd ..

./Database "Server=$<%= packageUpperCase %>_DB_SERVER;Database=$<%= packageUpperCase %>_DB_NAME;User Id=$<%= packageUpperCase %>_DB_USER;Password=$password;"

serviceName=<%= package %>
serviceNameWithPrefix=$serviceName
if [ -n "$SERVICE_NAME_PREFIX" ]; then
  serviceNameWithPrefix="${SERVICE_NAME_PREFIX}${serviceName}"
fi

# Stop service, if it exists.
if systemctl list-unit-files | grep -Fqw $serviceNameWithPrefix; then
  sudo systemctl stop $serviceNameWithPrefix
fi

cd ..

# Create a target folder
rm -rf $INSTALL_FOLDER/$serviceName
mkdir -p $INSTALL_FOLDER/$serviceName

# Copy files
cp -f ./$serviceName/* $INSTALL_FOLDER/$serviceName

cp -f ./start.sh $INSTALL_FOLDER/$serviceName
chmod a+x $INSTALL_FOLDER/$serviceName/start.sh

# Add execute permissions
chmod a+x $INSTALL_FOLDER/$serviceName/UserProj

envsubst < ./$serviceName/config.json > $INSTALL_FOLDER/$serviceName/config.json

# Allow group users to overwrite files during a new deploy
chmod g+rwx -R $INSTALL_FOLDER/$serviceName