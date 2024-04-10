from PyPDF2 import PdfReader
import tempfile


class PdfExtractResponse:
    def __init__(self, page_index, text) -> None:
        self.page_index = page_index
        self.text = text

    def to_dict(self):
        return {
            "page_index": self.page_index,
            "text": self.text
        }


class PdfExtractor:
    def __init__(self, buffer) -> None:
        self.buffer = buffer

    def extract_all_lines(self):
        res = []

        with tempfile.TemporaryFile() as temp:
            temp.write(self.buffer)
            temp.seek(0)
            reader = PdfReader(temp)

            pages = reader.pages

            for index, p in enumerate(pages):
                text = p.extract_text()
                res.append(PdfExtractResponse(index, text))

            print(res)

        return res
