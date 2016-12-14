#! /usr/bin/env python
# -*- coding: utf-8 -*-
import logging
from askomics.libaskomics.rdfdb.QueryLauncherInterface import QueryLauncherInterface
from askomics.libaskomics.rdfdb.QueryLauncherHttp import QueryLauncherHttp

from askomics.libaskomics.rdfdb.SparqlQueryBuilder import SparqlQueryBuilder

import subprocess

'''
    Implement request select/upload with virtuoso isql command
'''

class QueryLauncherVirtuoso(QueryLauncherInterface):
        admin = 'dba'

        def __init__(self, settings, session):
            QueryLauncherInterface.__init__(self, settings, session)
            self.qlhhttp = QueryLauncherHttp(settings, session)
            self.adminLogin   =  self.get_param("askomics.admin.login")
            self.adminPasswd  =  self.get_param("askomics.admin.passwd")
            self.envCommandIsql = self.get_param("askomics.virtuoso.env.isql.command")

            self.startIsql = self.envCommandIsql+' "isql-v -U '+self.adminLogin+' -P '+self.adminPasswd+' <<< \\"'
            self.endIsql   = '\\""'
            self.userLogin = self.get_param("askomics.endpoint.username")
            self.userPasswd = self.get_param("askomics.endpoint.passwd")
            self.isAdmin = self.get_param("askomics.endpoint.username") == self.get_param("askomics.admin.login")
            self.isNobody = self.get_param("askomics.endpoint.username").lower() == 'nobody'

            if self.isNobody :
                self.userLogin = self.userLogin.lower()

        def isql(self,cmd):
            self.log.debug(cmd)
            proc = subprocess.Popen([self.startIsql+cmd+self.endIsql], stdout=subprocess.PIPE, shell=True)
            (out, err) = proc.communicate()
            self.log.debug("ISQL CMD:"+cmd)
            self.log.debug("[OUT:"+str(out)+",ERR="+str(err)+"]")
            if err != None :
                self.log.err(err)

        def manage_current_graph(self,urigraph):
            if not self.isAdmin and not self.isNobody:
                # set private graph for user
                self.isql('DB.DBA.RDF_GRAPH_GROUP_INS (\'http://www.openlinksw.com/schemas/virtrdf#PrivateGraphs\',\''+urigraph+'\');')
                self.isql('DB.DBA.RDF_GRAPH_USER_PERMS_SET (\''+urigraph+'\', \''+self.userLogin+'\', 7);')

        def create_user_account(self):

            if not self.isAdmin and not self.isNobody :
                # set private graph for user
                self.manage_current_graph(self.get_private_graph())
                #create the user if he does not exist
                self.isql('DB.DBA.USER_CREATE (\''+self.userLogin+'\', \''+self.userPasswd+'\');')
                #grant update for private graphs
                self.isql('GRANT SPARQL_UPDATE to "'+self.userLogin+'";')
                #by default none graph are reachable
                self.isql('DB.DBA.RDF_DEFAULT_USER_PERMS_SET (\''+self.userLogin+'\', 0);')
                #for anyone
                self.isql('DB.DBA.RDF_DEFAULT_USER_PERMS_SET (\'nobody\', 0);')
                #get public the main public graph
                self.isql('DB.DBA.RDF_GRAPH_USER_PERMS_SET (\''+self.get_public_graph()+'\', \''+self.userLogin+'\', 1);')
                #and all subgraph
                sqb =SparqlQueryBuilder(self.settings, self.session)
                req = "SELECT DISTINCT ?g WHERE {"
                req += "GRAPH <"+self.get_public_graph()+"> { ?g rdfg:subGraphOf <"+self.get_public_graph()+">}}"
                prefixes = sqb.header_sparql_config(req)
                query = prefixes+req
                results = self.process_query(query,user=self.adminLogin,passwd=self.adminPasswd)
                for elt in results:
                    self.log.debug("[PUBLIC ACCES GRAPHH:"+elt['g']+"]")
                    self.isql('DB.DBA.RDF_GRAPH_USER_PERMS_SET (\''+elt['g']+'\', \''+self.userLogin+'\', 1);')



        def delete_user_account(self):
            if not self.isAdmin and not self.isNobody :
                self.isql('DB.DBA.USER_DROP (\''+self.userLogin+'\',0);')

        def execute_query(self, query, user = None , passwd = None, log_raw_results=True):
            return self.qlhhttp.execute_query(query,user,passwd,log_raw_results)

        def process_query(self, query, user = None , passwd = None):
            return self.qlhhttp.process_query(query,user,passwd)

        def format_results_csv(self, table):
            return self.qlhhttp.format_results_csv(table)

        def load_data(self, url, graphName):
            self.manage_current_graph(graphName)
            return self.qlhhttp.load_data(url, graphName)

        def insert_data(self, ttl_string, graph, ttl_header=""):
            self.manage_current_graph(graph)
            return self.qlhhttp.insert_data(ttl_string, graph, ttl_header)
