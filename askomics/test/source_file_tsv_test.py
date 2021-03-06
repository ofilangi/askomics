import os
import unittest
import json
import tempfile, shutil

from shutil import copyfile
from pyramid import testing
from pyramid.paster import get_appsettings

from askomics.libaskomics.source_file.SourceFile import SourceFile
from askomics.libaskomics.source_file.SourceFileTsv import SourceFileTsv
from interface_tps import InterfaceTPS

SIMPLE_SOURCE_FILE = os.path.join( os.path.dirname( __file__ ), "..", "test-data", "instruments.tsv" )

class SourceFileTsvTests(unittest.TestCase):

    def setUp( self ):
        self.settings = get_appsettings('configs/test.virtuoso.ini', name='main')
        self.settings['askomics.upload_user_data_method'] = 'insert'
        self.request = testing.DummyRequest()
        self.request.session['username'] = 'jdoe'
        self.request.session['group'] = 'base'
        self.request.session['admin'] = False
        self.request.session['blocked'] = True

        # Files
        # Create the user dir if not exist
        self.temp_directory = self.settings['askomics.files_dir'] + '/upload/' + self.request.session['username']
        if not os.path.isdir(self.temp_directory):
            os.makedirs(self.temp_directory)
        # Set the upload dir
        self.request.session['upload_directory'] = self.temp_directory
        # Copy files if directory is empty

        files = ['people.tsv', 'instruments.tsv', 'play_instrument.tsv', 'transcript.tsv', 'qtl.tsv']
        for file in files:
            src = os.path.join(os.path.dirname(__file__), "..", "test-data") + '/' + file
            dst = self.request.session['upload_directory'] + '/' + file
            copyfile(src, dst)

    def tearDown(self):
        shutil.rmtree( self.temp_directory )

    def test_setGraph(self):
        source_file = SourceFileTsv(self.settings, self.request.session, self.request.session['upload_directory'] + '/instruments.tsv',preview_limit=1)
        source_file.setGraph("hello:world")

    def test_load_headers_from_file(self):
        source_file = SourceFileTsv(self.settings, self.request.session, self.request.session['upload_directory'] + '/instruments.tsv',preview_limit=1)

        assert source_file.headers == ['Instruments', 'Name', 'Class']

    def load_data_from_file(self):
        source_file = SourceFileTsv(self.settings, self.request.session, self.request.session['upload_directory'] + '/instruments.tsv',preview_limit=1)

        try:
            source_file.load_data_from_file(None,'http://localhost:6543/')
            assert False
        except Exception as e:
            assert True

    def test_get_strand(self):
        assert SourceFileTsv.get_strand(None) == "askomics:none"
        assert SourceFileTsv.get_strand("+") == "askomics:plus"
        assert SourceFileTsv.get_strand("-") == "askomics:minus"

    def test_get_strand_faldo(self):
        assert SourceFileTsv.get_strand_faldo(None) == "faldo:BothStrandPosition"
        assert SourceFileTsv.get_strand_faldo("+") == "faldo:ForwardStrandPosition"
        assert SourceFileTsv.get_strand_faldo("-") == "faldo:ReverseStrandPosition"
