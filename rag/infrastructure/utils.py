import os
from core.doc import SourceDoc


class Utils:

    @staticmethod
    def get_docs():
        doc_dir = os.path.join(os.curdir, "tmp/docs")
        result = []
        for file_path in os.listdir(doc_dir):
            if os.path.isfile(os.path.join(doc_dir, file_path)):
                result.append(SourceDoc(file_path, os.path.join(doc_dir, file_path)))
        return result