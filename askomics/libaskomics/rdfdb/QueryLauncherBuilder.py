#! /usr/bin/env python
# -*- coding: utf-8 -*-
import logging
from askomics.libaskomics.rdfdb.QueryLauncherHttp import QueryLauncherHttp
from askomics.libaskomics.rdfdb.QueryLauncherVirtuoso import QueryLauncherVirtuoso
from askomics.libaskomics.ParamManager import ParamManager

"""
    Build a type of query launcher
"""

class QueryLauncherBuilder(ParamManager):

    def __init__(self,settings,session):
        ParamManager.__init__(self, settings, session)
        self.session = session
        self.settings = settings
        self.typeLauncher = "default"
        if self.is_defined("askomics.tps"):
            self.typeLauncher = self.get_param("askomics.tps")
        self.log = logging.getLogger(__name__)

    def get(self):
        self.log.debug(" =========== QueryLauncherBuilder:get ===========")
        self.log.debug("typeLauncher ["+self.typeLauncher+"]")

        if self.typeLauncher == 'virtuoso':
            return QueryLauncherVirtuoso(self.settings,self.session);


        return QueryLauncherHttp(self.settings,self.session);
