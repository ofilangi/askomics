/*jshint esversion: 6 */

/*
  CLASSE AskomicsUserAbstraction
  Manage Abstraction storing in the TPS.
*/

let instanceUserAbstraction ;

class AskomicsUserAbstraction {
   constructor() {
    /* Implement a Singleton */
    if ( instanceUserAbstraction !== undefined ) {
       return instanceUserAbstraction;
    }
    this.prefix = {};
      /* Ontology is save locally to avoid request with TPS  */
      /* --------------------------------------------------- */
    this.tripletSubjectRelationObject = [];
    this.entityInformationList = {}; /*   entityInformationList[uri1][rel] = uri2 ; */
    this.relationInformationList = {};
    this.attributesInformationList = {};
    this.attributesEntityList = {};  /*   attributesEntityList[uri1] = [ att1, att2,... ] */

    /* uri ->W get information about ref, taxon, start, end */
//    this.entityPositionableInformationList = {}; /* entityPositionableInformationList[uri1] = { taxon, ref, start, end } */
    this.attributesOrderDisplay = {} ;           /* manage a order list by URInode */

    instanceUserAbstraction = this;
    return instanceUserAbstraction;
    }

    longRDF(litteral) {
      if ( litteral === "" || litteral === undefined ) return litteral ;
      let idx = litteral.lastIndexOf(":");
      let p = this.getPrefix(litteral.substring(0,idx));
      return p+litteral.substring(idx+1);
    }

    shortRDF(litteral) {
      if ( litteral === "" || litteral === undefined ) return litteral ;
      for (let p in this.prefix ) {
        let idx = litteral.indexOf(this.prefix[p]);
        if ( idx !== -1 ) {
          return p+":"+litteral.substring(idx+this.prefix[p].length);
        }
      }
      return litteral;
    }

    getEntities() {
      return JSON.parse(JSON.stringify(Object.keys(this.entityInformationList))) ;
    }

    getAttributesEntity(uriEntity) {
      if ( uriEntity in this.attributesEntityList )
        return JSON.parse(JSON.stringify(this.attributesEntityList[uriEntity])) ;

      return [];
    }

    getPositionableEntities() {
      let positionaleEntities = {};
      for ( let uri_entity in this.entityInformationList ) {
        if ( this.getAttribEntity(uri_entity,new AskomicsUserAbstraction().longRDF('askomicsns:hasOwnClassVisualisation')) === 'AskomicsPositionableNode' ) {
          positionaleEntities[uri_entity] = this.entityInformationList[uri_entity];
        }
      }

      return positionaleEntities;
      //return JSON.parse(JSON.stringify(this.entityPositionableInformationList)) ;
    }

    static getTypeAttribute(attributeForUritype) {

      if ( attributeForUritype.indexOf(new AskomicsUserAbstraction().getPrefix("xsd")) === -1 ) {
          return "category";
      }

      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:decimal")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:string")) {
        return "string";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:boolean")) {
        return "string";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:nonNegativeInteger")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:integer")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:float")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:int")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:long")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:short")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:byte")) {
        return "decimal";
      }
      if (attributeForUritype === new AskomicsUserAbstraction().longRDF("xsd:language")) {
        return "string";
      }
      return attributeForUritype;
    }

    /*
    load ontology
    see template SPARQL to know sparql variable
    */
    /* Request information in the model layer */
    //this.updateOntology();
    loadUserAbstraction() {
      var service = new RestServiceJs("userAbstraction");

      service.getsync(function(resultListTripletSubjectRelationObject ) {
      console.log("========================= ABSTRACTION =====================================================================");

      /* All relation are stored in tripletSubjectRelationObject */
      instanceUserAbstraction.tripletSubjectRelationObject = resultListTripletSubjectRelationObject.relations;
      /* == External Service can add external relation == */
      //instanceUserAbstraction.tripletSubjectRelationObject = instanceUserAbstraction.tripletSubjectRelationObject.concat(GONode.getRemoteRelations());
      console.log("RELATIONS::"+JSON.stringify(instanceUserAbstraction.tripletSubjectRelationObject));


      instanceUserAbstraction.entityInformationList = {};
      instanceUserAbstraction.relationInformationList = {};
      instanceUserAbstraction.attributesInformationList = {};
      instanceUserAbstraction.attributesEntityList = {};
      //-------------------------------------------------------------------------------------------
      // update prefix
      for (let i in resultListTripletSubjectRelationObject.prefix) {
        instanceUserAbstraction.prefix[i] = resultListTripletSubjectRelationObject.prefix[i];
      }
      console.log("=================== PREFIX =========================");
      console.log("PREFIX:"+JSON.stringify(instanceUserAbstraction.prefix));
      //-------------------------------------------------------------------------------------------
      /* All information about an entity available in TPS are stored in entityInformationList */
      for (let entry in resultListTripletSubjectRelationObject.entities){
        console.log("ENTITY:"+JSON.stringify(resultListTripletSubjectRelationObject.entities[entry]));
        let uri = resultListTripletSubjectRelationObject.entities[entry].entity;
        let rel = resultListTripletSubjectRelationObject.entities[entry].property;
        let val = resultListTripletSubjectRelationObject.entities[entry].value;

        if ( ! (uri in instanceUserAbstraction.entityInformationList) ) {
            instanceUserAbstraction.entityInformationList[uri] = {};
        }
        instanceUserAbstraction.entityInformationList[uri][rel] = val;
      }
      console.log("entityInformationList:"+JSON.stringify(instanceUserAbstraction.entityInformationList));

      for (let entry in resultListTripletSubjectRelationObject.relationsInfo){
        console.log("RELATIONINFO:"+JSON.stringify(resultListTripletSubjectRelationObject.relationsInfo[entry]));
        let uri = resultListTripletSubjectRelationObject.relationsInfo[entry].relation;
        let rel = resultListTripletSubjectRelationObject.relationsInfo[entry].property;
        let val = resultListTripletSubjectRelationObject.relationsInfo[entry].value;

        if ( ! (uri in instanceUserAbstraction.relationInformationList) ) {
            instanceUserAbstraction.relationInformationList[uri] = {};
        }
        instanceUserAbstraction.relationInformationList[uri][rel] = val;
      }

      console.log("relationInformationList:"+JSON.stringify(instanceUserAbstraction.relationInformationList));

	    for (let entry2 in resultListTripletSubjectRelationObject.attributes){
        console.log("ATTRIBUTE:"+JSON.stringify(resultListTripletSubjectRelationObject.attributes[entry2]));
        let uri2 = resultListTripletSubjectRelationObject.attributes[entry2].entity;
        let attribute = {};
        attribute.uri   = resultListTripletSubjectRelationObject.attributes[entry2].attribute;
        attribute.label = resultListTripletSubjectRelationObject.attributes[entry2].labelAttribute;
        attribute.type  = resultListTripletSubjectRelationObject.attributes[entry2].typeAttribute;
        attribute.basic_type  = AskomicsUserAbstraction.getTypeAttribute(resultListTripletSubjectRelationObject.attributes[entry2].typeAttribute);

          if ( ! (uri2 in instanceUserAbstraction.attributesEntityList) ) {
              instanceUserAbstraction.attributesEntityList[uri2] = [];
          }

          instanceUserAbstraction.attributesEntityList[uri2].push(attribute);
        }
        /*  SPECIAL ATTRIBUTE FOR USER ENTITIES . RDFS:LABEL */
        for (let uriEntity in instanceUserAbstraction.attributesEntityList ) {
          console.log("==============>> "+new AskomicsUserAbstraction().longRDF("rdfs:label"));
          let longrdf = new AskomicsUserAbstraction().longRDF("rdfs:label") ;
          if ( longrdf in instanceUserAbstraction.entityInformationList[uriEntity]) {
            console.log("ok:"+uriEntity);
            let attribute = {};
            attribute.uri   = longrdf;
            attribute.label = "rdfs:label";
            attribute.type  = longrdf;
            attribute.basic_type = AskomicsUserAbstraction.getTypeAttribute(new AskomicsUserAbstraction().longRDF("xsd:string"));
            instanceUserAbstraction.attributesEntityList[uriEntity].unshift(attribute);
          }
        }

        for (let entry3 in resultListTripletSubjectRelationObject.categories){
          console.log("CATEGORY:"+JSON.stringify(resultListTripletSubjectRelationObject.categories[entry3]));
          let uri3 = resultListTripletSubjectRelationObject.categories[entry3].entity;
          let attribute = {};
          attribute.uri      = resultListTripletSubjectRelationObject.categories[entry3].category;
          attribute.label    = resultListTripletSubjectRelationObject.categories[entry3].labelCategory;
          attribute.type     = resultListTripletSubjectRelationObject.categories[entry3].typeCategory;
          attribute.basic_type  = 'category';

          if ( ! (uri3 in instanceUserAbstraction.attributesEntityList) ) {
              instanceUserAbstraction.attributesEntityList[uri3] = [];
          }

          instanceUserAbstraction.attributesEntityList[uri3].push(attribute);
        }

        console.log("=================== attributesEntityList =========================");
        console.log(JSON.stringify(instanceUserAbstraction.attributesEntityList));

        //console.log("=================== attributesINFO =========================");
        //console.log(JSON.stringify(resultListTripletSubjectRelationObject.attributesInfo));
        //-------------------------------------------------------------------------------------------
        /* All information about an entity available in TPS are stored in entityInformationList */
        for (let entry in resultListTripletSubjectRelationObject.attributesInfo){
          console.log("Attributes:"+JSON.stringify(resultListTripletSubjectRelationObject.attributesInfo[entry]));
          let uri = resultListTripletSubjectRelationObject.attributesInfo[entry].entity;
          let rel = resultListTripletSubjectRelationObject.attributesInfo[entry].property;
          let val = resultListTripletSubjectRelationObject.attributesInfo[entry].value;

          if ( ! (uri in instanceUserAbstraction.attributesInformationList) ) {
              instanceUserAbstraction.attributesInformationList[uri] = {};
          }
          instanceUserAbstraction.attributesInformationList[uri][rel] = val;
        }
        console.log("attributesInformationList:"+JSON.stringify(instanceUserAbstraction.attributesInformationList));

      });
    }

    getPrefix(ns) {
      if (! (ns in this.prefix)) {
        //get info in prefix.cc
        //
        $.ajax({
          async: false,
          type: 'GET',
          url: 'http://prefix.cc/'+ns.trim()+'.file.json',
          success: function( result_json ) {
            console.log("new prefix:"+ns+"==>"+result_json[ns]);
            instanceUserAbstraction.prefix[ns] = result_json[ns];
          },
          error: function(req, status, ex) {},
          timeout:30
        });
      }
      return this.prefix[ns];
    }

    getAttribEntity(uriEntity,attrib) {
      return this.getGenAttrib(this.entityInformationList,uriEntity,attrib);
    }

    getAttribRelation(uri,attrib) {
      return this.getGenAttrib(this.relationInformationList,uri,attrib);
    }

    getAttribAttributes(uri,attrib) {
      return this.getGenAttrib(this.attributesInformationList,uri,attrib);
    }

    /* Get value of an attribut with RDF format like rdfs:label */
    getGenAttrib(diction,uriEntity,attrib) {
      let nattrib = attrib ;

      if (!(uriEntity in diction)) {
        /*
        console.log(JSON.stringify(uriEntity) + " is not referenced in the user abstraction !");
        console.log("Entities referenced:");
        for (let uri in diction ) {
          console.log(uri);
        }
        */
        return "";
      }

      if (!(nattrib in diction[uriEntity])) {
        /*
        console.log(JSON.stringify(uriEntity) + '['+JSON.stringify(nattrib)+']' + " (attribute) is not referenced in the user abstraction !");
        console.log("Attributes referenced for uri["+uriEntity+"]:");
        for (let uri in diction[uriEntity] ) {
          console.log(uri);
        }
        */
        return "";
      }

      return diction[uriEntity][nattrib];
    }

    /* build node from user abstraction infomation */
    buildBaseNode(uriEntity) {
      var node = {
        uri   : uriEntity,
        label : this.getAttribEntity(uriEntity,new AskomicsUserAbstraction().longRDF('rdfs:label'))
      } ;
      return node;
    }


    /*
    Get
    - relations with UriSelectedNode as a subject or object
    - objects link with Subject UriSelectedNode
    - Subjects link with Subject UriSelectedNode
     */

    getRelationsObjectsAndSubjectsWithURI(UriSelectedNode) {

      var objectsTarget = {} ;
      var subjectsTarget = {} ;

      for (let i in this.tripletSubjectRelationObject) {
        if ( this.tripletSubjectRelationObject[i].object == UriSelectedNode ) {
          if (! (this.tripletSubjectRelationObject[i].subject in subjectsTarget) ) {
            subjectsTarget[this.tripletSubjectRelationObject[i].subject] = [];
          }
          subjectsTarget[this.tripletSubjectRelationObject[i].subject].push(this.tripletSubjectRelationObject[i].relation);
        }
        if ( this.tripletSubjectRelationObject[i].subject == UriSelectedNode ) {
          if (! (this.tripletSubjectRelationObject[i].object in objectsTarget) ) {
            objectsTarget[this.tripletSubjectRelationObject[i].object] = [];
          }
          objectsTarget[this.tripletSubjectRelationObject[i].object].push(this.tripletSubjectRelationObject[i].relation);
        }
      }
      // TODO: Manage Doublons and remove it....

      return [objectsTarget, subjectsTarget];
    }

    /* return a list of attributes according a uri node */
    getAttributesWithURI(UriSelectedNode) {
      if ( UriSelectedNode in this.attributesEntityList )
        return this.attributesEntityList[UriSelectedNode];
      return [];
    }

    /* Setting order attribute display */
    setOrderAttributesList(URINode,listAtt) {
      this.attributesOrderDisplay[URINode] = listAtt.slice();
    }

    getOrderAttributesList(URINode) {
      if ( URINode in this.attributesOrderDisplay ) {
        return this.attributesOrderDisplay[URINode];
      }
      /* by default */
      let v = [];
      v.push( { 'uri': URINode , 'basic_type' : 'string' });
      if ( URINode in this.attributesEntityList ) {
        v = v.concat(this.attributesEntityList[URINode].slice());
      }
/*
      for (let i in this.attributesEntityList[URINode] ) {
          v.push(this.attributesEntityList[URINode][i]);
      }*/
      return v;
    }
  }
