/*jshint esversion: 6 */
/*jshint multistr:true */

/*
var askomics_abstraction="\
?attribute askomicsns:attribute \"true\"^^xsd:boolean .\
\
?attribute rdf:type owl:DatatypeProperty;\
           rdfs:label ?labelAttribute ;\
           rdfs:domain ?entity;\
           rdfs:range ?typeAttribute.\
";
*/

let instanceGOParametersView;

class GOParametersView extends InterfaceParametersView {

  constructor() {
    super();
    /* Implement a Singleton */
    if ( instanceGOParametersView !== undefined ) {
        return instanceGOParametersView;
    }

    /* adding */
/*
    $("body").append($("<script />", {
      src: "http://cdn.berkeleybop.org/jsapi/bbop.js"
    }));
*/
    this.config = {
      //url_service              : "http://cloud-60.genouest.org/go/sparql"     ,
      //url_service              : "http://localhost:8891/sparql"     ,
      number_char_search_allow : 5                                            ,
      web_link                 : "http://amigo.geneontology.org/amigo/term/%s"  ,
      askomics_abstraction     : ''
    };

    instanceGOParametersView = this;
  }

  configurationView() {

    /* if the content have ever been created */
    if ( $("#content_gene_ontology").length>0) return;

    /* build otherwise */
    let container = $("<div></div>").addClass("container").attr("id","content_gene_ontology");
    let lab = $("<h3></h3>").html("Gene Ontology Service");


    container.append($('<hr/>'))
             .append(lab)
             .append($('<hr/>'))
             .append(this.createTextArea("ABSTRACTION",'askomics_abstraction',"Inject in the triplestore",function(e){

             }))
             .append($('<hr/>'))
             .append(this.createInput("NUMBER OF CHAR",'number_char_search_allow'))
             .append($('<hr/>'))
             .append(this.createInput("WEB LINK",'web_link'));

    $('body').append(container);
  }

}
