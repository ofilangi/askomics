#! /usr/bin/env python
# -*- coding: utf-8 -*-

import logging

from abc import ABC, abstractmethod
from askomics.libaskomics.ParamManager import ParamManager

class QueryLauncherInterface(ParamManager,ABC):

    def __init__(self, settings, session):
        ParamManager.__init__(self, settings, session)
        self.log = logging.getLogger(__name__)
        super(QueryLauncherInterface, self).__init__(settings, session)

    @abstractmethod
    def create_user_account(self):
        pass

    @abstractmethod
    def delete_user_account(self):
        pass

    @abstractmethod
    def execute_query(self, query, user = None , passwd = None, log_raw_results=True):
        pass

    @abstractmethod
    def process_query(self, query, user = None , passwd = None):
        pass

    @abstractmethod
    def format_results_csv(self, table):
        pass

    @abstractmethod
    def load_data(self, url, graphName):
        pass

    @abstractmethod
    def insert_data(self, ttl_string, graph, ttl_header=""):
        pass
