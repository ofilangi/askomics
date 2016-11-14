/*jshint esversion: 6 */

class AskomicsObjectBuilder {

  constructor() {
  }

  static instanceNode(node,x,y) {

    /* Check if abstraction store the taget class to instancied */
    let className = new AskomicsUserAbstraction().getAttribEntity(node.uri,new AskomicsUserAbstraction().longRDF('askomicsns:hasOwnClassVisualisation'));
    if ( className !== "") {
      return new classesMapping[className](node,x,y);
    }

    //by default !
    return new AskomicsNode(node,x,y);
  }

  static instanceLink(linkbase,source,target) {

    if (source.constructor.name === 'GONode' || target.constructor.name === 'GONode') {
      return new GOLink(linkbase,source,target);
    }

    return  new AskomicsLink(linkbase,source,target);
  }
}
