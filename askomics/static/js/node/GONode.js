/*jshint esversion: 6 */
/*
http://geneontology.org/page/go-rdfxml-file-format

*/
class GONode extends AskomicsNode {

  constructor(node,x,y) {
    super(node,x,y);
    this.label = "GO Term";
    this.filterOnOboId = [];
    return this;
  }

  set filterOnOboId (__filterOnOboId) { this._filterOnOboId = __filterOnOboId; }
  get filterOnOboId () { return this._filterOnOboId; }

  setjson(obj) {
    super.setjson(obj);
    this.filterOnOboId = obj._filterOnOboId ;
  }

  getPanelView() {
    return new GONodeView(this);
  }

  addOboIdFilter(oboid) {
    this.filterOnOboId.push(oboid);
  }

  deleteOboIdFilter(oboid) {
    for (let i=0;i<this.filterOnOboId.length;i++) {
      if ( this.filterOnOboId[i] == oboid ) {
        this.filterOnOboId.splice(i,1);
        return ;
      }
    }
  }

  buildConstraintsSPARQL() {

    let blockConstraintByNode = [];
    //blockConstraintByNode.push('?URI'+this.SPARQLid+' rdfs:label ?Label'+this.SPARQLid);
    blockConstraintByNode = blockConstraintByNode.concat(super.buildConstraintsSPARQL()[0]);

    if ( this.filterOnOboId.length > 0 ) {
      blockConstraintByNode.push('?'+this.SPARQLid+' rdfs:subClassOf* '+'?oboid'+this.SPARQLid);
      let valueFilterOnOboId = 'VALUES ?oboid'+this.SPARQLid + " {";
      for (let i=0; i<this.filterOnOboId.length;i++) {
        valueFilterOnOboId += " <"+this.filterOnOboId[i]+">";
      }
      valueFilterOnOboId += " }";
      blockConstraintByNode.push(valueFilterOnOboId);
    }

    /*     TEST       */
    //blockConstraintByNode.push('?subClass'+this.SPARQLid+' rdfs:subClassOf* '+'?URI'+this.SPARQLid);
    // obo: ne match pas avec la bonne url....on met en dure pour les tests
    //blockConstraintByNode.push('?subClass'+this.SPARQLid+' <http://www.geneontology.org/formats/oboInOwl#id> ?id2'+this.SPARQLid);
    //blockConstraintByNode.push('?subClass'+this.SPARQLid+' rdfs:label ?desc2'+this.SPARQLid);
    let service = new AskomicsUserAbstraction().getAttribEntity(this.uri,new AskomicsUserAbstraction().longRDF("askomicsns:hasUrlExternalService"));

    if ( service !== '' ) {
      service = 'SERVICE <'+service+'>';
    }

    return [
            blockConstraintByNode,service
          ];
  }
/*
  instanciateVariateSPARQL(variates) {
    variates.push("?Label"+this.SPARQLid);
    variates.push("?OBONamespace"+this.SPARQLid);
    variates.push("?IAODefinition"+this.SPARQLid);
    variates.push("?Comment"+this.SPARQLid);

    variates.push("?BroadSynonym"+this.SPARQLid);
    variates.push("?RelatedSynonym"+this.SPARQLid);
    variates.push("?ExactSynonym"+this.SPARQLid);
    variates.push("?NarrowSynonym"+this.SPARQLid);
    //variates.push("?Definition"+this.SPARQLid);

    //variates.push("?rel"+this.SPARQLid);
    //variates.push("?valueString"+this.SPARQLid);

    //variates.push('?subClass'+this.SPARQLid);
    //variates.push('?desc2'+this.SPARQLid);
    //variates.push('?id2'+this.SPARQLid);
  }
*/
  getAttributesDisplaying() {
    let list_id = [];
    let list_label = [];
    let map_url = {} ;

    list_id.push("tmp_"+this.SPARQLid);
    list_label.push("Id");
    map_url["tmp_"+this.SPARQLid] = new GOParametersView().config.web_link;

    let lD = super.getAttributesDisplaying();
    list_id = list_id.concat(lD.id);
    list_label = list_label.concat(lD.label);

    /*
    list_id.push("Label"+this.SPARQLid);
    list_label.push("Label");

    list_id.push("OBONamespace"+this.SPARQLid);
    list_label.push("Namespace");
    list_id.push("IAODefinition"+this.SPARQLid);
    list_label.push("IAO:Definition");
    list_id.push("Comment"+this.SPARQLid);
    list_label.push("Comment");
    list_id.push("BroadSynonym"+this.SPARQLid);
    list_label.push("BroadSynonym");
    list_id.push("RelatedSynonym"+this.SPARQLid);
    list_label.push("RelatedSynonym");
    list_id.push("ExactSynonym"+this.SPARQLid);
    list_label.push("ExactSynonym");
    list_id.push("NarrowSynonym"+this.SPARQLid);
    list_label.push("NarrowSynonym");
    //list_id.push("Definition"+this.SPARQLid);
    //list_label.push("OBO:Definition");
*/
    return {'id' : list_id, 'label': list_label, 'url': map_url };
  }

  /* To informe userAbstraction with new relation managed by GO */
  static getRemoteRelations() {
/*
    http://www.geneontology.org/formats/oboInOwl#hasAlternativeId    ===> GO:TERM
    http://www.geneontology.org/formats/oboInOwl#hasDbXref           ===> Reactome:REACT_30266,Wikipedia:Apoptosis,NIF_Subcellular:sao1702920020
*/
    let allRel = [] ;

    allRel.push({
      'subject'  : "http://purl.org/obo/owl/GO#term" ,
      'object'   : "http://purl.org/obo/owl/GO#term" ,
      'relation' : 'http://www.geneontology.org/formats/oboInOwl#hasAlternativeId'});

    allRel.push({
        'subject'  : "http://purl.org/obo/owl/GO#term" ,
        'object'   : "http://identifiers.org/reactome#term" ,
        'relation' : 'http://www.geneontology.org/formats/oboInOwl#hasDbXref'});
    allRel.push({
        'subject'  : "http://purl.org/obo/owl/GO#term" ,
        'object'   : "https://en.wikipedia.org/wiki#term" ,
        'relation' : 'http://www.geneontology.org/formats/oboInOwl#hasDbXref'});

    return allRel ;
  }

  getTextFillColor() { return 'Coral'; }
  getTextStrokeColor() { return 'Coral'; }
  getNodeFillColor() { return 'Coral'; }
  getNodeStrokeColor() { return 'yellowgreen'; }
  getRNode() { return 13; }

}
