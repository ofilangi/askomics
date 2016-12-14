export VENV=~/env
virtualenv -p python3 $VENV
$VENV/bin/pip install -e .

$VENV/bin/python setup.py develop
#$VENV/bin/pserve configs/development.fuseki.ini
$VENV/bin/pserve configs/development.virtuoso.ini

#Executing tests
#python3.4 setup.py nosetests

#enerate script travis

