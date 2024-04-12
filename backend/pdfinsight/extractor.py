import tempfile
from io import StringIO
from pypdf import PdfReader
from pdfminer.high_level import extract_text_to_fp


class PdfExtractResponse:
    def __init__(self, page_number, lines) -> None:
        self.page_number = page_number
        self.lines = lines

    def to_dict(self):
        return {
            "page_number": self.page_number,
            "lines": self.lines
        }


class PdfExtractor:
    def __init__(self, buffer) -> None:
        self.buffer = buffer

    def extract(self):
        page_result = []

        output_string = StringIO()
        with tempfile.TemporaryFile() as temp:
            temp.write(self.buffer)
            temp.seek(0)

            extract_text_to_fp(temp, output_string)
            reader = PdfReader(temp)
            pages = reader.pages
            all_lines = []

            for i, p in enumerate(pages):
                text = p.extract_text()
                print(f'Page {i}: {text}\n')
                current_lines = text.split("\n")
                for j, line in enumerate(current_lines):
                    all_lines.append(line)
                page_result.append(PdfExtractResponse(i, all_lines))

        return page_result
