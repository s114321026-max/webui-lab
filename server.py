from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


app = FastAPI(
    docs_url="/api/docs",
    root_path="/s114321026"  
)


app.mount("/", StaticFiles(directory="site", html=True), name="site")