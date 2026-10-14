import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
public_directory = os.path.join(os.path.dirname(__file__), "site")

class HtmlCssOnlyStaticFiles(StaticFiles):
    allowed_extensions = {".css", ".html", ".svg", ".json", ".js"}
    allowed_directories = {"js", "json", "css", "images"}

# 1. 支援帶有學號前綴的靜態資源存取（解決 base href 造成的 404）
app.mount(
    "/s114321026",
    HtmlCssOnlyStaticFiles(directory=public_directory, html=True),
    name="student_prefix",
)

# 2. 支援根目錄存取
app.mount(
    "/",
    HtmlCssOnlyStaticFiles(directory=public_directory, html=True),
    name="public",
)