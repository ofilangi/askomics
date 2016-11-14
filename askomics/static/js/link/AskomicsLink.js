/*jshint esversion: 6 */

class AskomicsLink extends GraphLink {


  constructor(link,sourceN,targetN) {
    super(link,sourceN,targetN);
    this._transitive = false ;
    this._negative   = false ;
  }

  set transitive (transitive) { this._transitive = transitive; }
  get transitive () { return this._transitive; }

  set negative (negative) { this._negative = negative; }
  get negative () { return this._negative; }

  setjson(obj) {
    super.setjson(obj);

    this._transitive = obj._transitive ;
    this._negative = obj._negative ;

  }

  getPanelView() {
    return new AskomicsLinkView(this);
  }

  buildConstraintsSPARQL() {
    let blockConstraintByNode = [];
    let rel = this.URI();
    if ( this.transitive ) rel += "+";
    blockConstraintByNode.push("?"+this.source.SPARQLid+" "+rel+" "+"?"+this.target.SPARQLid);
    if ( this.negative ) {
      blockConstraintByNode = [blockConstraintByNode,'FILTER NOT EXISTS'];
    }

    let service = new AskomicsUserAbstraction().getAttribRelation(this.uri,new AskomicsUserAbstraction().longRDF("askomicsns:hasUrlExternalService"));

    if ( service !== '' ) {
      //service = new TriplestoreParametersView().config.endpoint;
      service = 'SERVICE <'+service+'>';
    }

    return [blockConstraintByNode,service];
  }

  instanciateVariateSPARQL(variates) {

  }

  getLinkStrokeColor() { return super.getLinkStrokeColor(); }

}
