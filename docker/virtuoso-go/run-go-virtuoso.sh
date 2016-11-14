#!/bin/bash
set -e

# script with sudo

GODIR=/var/local/go
#GOFILEURL=http://purl.obolibrary.org/obo/go/extensions/go-plus.owl
GOFILEURL=http://purl.obolibrary.org/obo/go.owl
#GOFILEURL=http://archive.geneontology.org/latest-termdb/go_daily-termdb.rdf-xml

if [ ! -d "$GODIR" ]; then
	mkdir $GODIR
fi

cp $(dirname $0)/virtuoso.ini $GODIR/

docker run --name go-virtuoso \
-e VIRT_Parameters_TN_MAX_memory=4000000000 \
-e VIRT_SPARQL_ResultSetMaxRows=100000 \
-e VIRT_SPARQL_MaxQueryCostEstimationTime=300 \
-e VIRT_SPARQL_MaxQueryExecutionTime=300 \
-e VIRT_SPARQL_MaxDataSourceSize=1000000000 \
-e VIRT_Flags_TN_MAX_memory=4000000000 \
        -p 8891:8890 -p 1112:1111 \
        -e SPARQL_UPDATE=true \
        -v $GODIR:/data \
        -d tenforce/virtuoso

sleep 10
# load data
curl -i --data-urlencode query="LOAD <$GOFILEURL> INTO GRAPH <$GOFILEURL>" -H "Content-Type: application/sparql-query" -G http://localhost:8891/sparql
# querying database
curl -i --data-urlencode query="select (count(?s) as ?count) where { ?s ?p ?o . }" -H "Content-Type: application/sparql-query" -G http://localhost:8891/sparql
