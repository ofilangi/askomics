/*jshint esversion: 6 */

class GOLink extends GraphLink {

  constructor(link,sourceN,targetN) {
    super(link,sourceN,targetN);
  }
  setjson(obj) {
    super.setjson(obj);
  }
  getPanelView() {
    return new GOLinkView(this);
  }

  getFillColor() { return 'darkgreen'; }

  buildConstraintsSPARQL() {
    let blockConstraintByNode = [];
    let rel = this.URI();

    blockConstraintByNode.push('?URI'+this.source.SPARQLid+" "+rel+" "+'?tmp_URI'+this.target.SPARQLid);
    blockConstraintByNode.push("BIND (IRI ( REPLACE(str("+'?tmp_URI'+this.target.SPARQLid+"),\"GO:\",\"http://purl.obolibrary.org/obo/GO_\",\"i\")) AS "+'?URI'+this.target.SPARQLid+")");
    let service = new AskomicsUserAbstraction().getAttribRelation(this.uri,new AskomicsUserAbstraction().longRDF("askomicsns:hasUrlExternalService"));

    if ( service !== '' ) {
      service = 'SERVICE <'+service+'>';
    }
    return [blockConstraintByNode,service];
  }

  instanciateVariateSPARQL(variates) {
    variates.push('?tmp_URI'+this.target.SPARQLid);
  }
}
