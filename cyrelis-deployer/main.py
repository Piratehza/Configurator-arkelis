from fastapi import FastAPI, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import csv
import io

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/export-bitwarden-csv")
async def export_bitwarden_csv(request: Request):
    """
    Exporte les identifiants au format CSV compatible Bitwarden
    """
    try:
        body = await request.json()
        credentials = body.get('credentials', [])
        
        if not credentials:
            return JSONResponse({"success": False, "message": "Aucun identifiant fourni"})
        
        # Format CSV strict Bitwarden
        csv_buffer = io.StringIO()
        fieldnames = ['folder', 'favorite', 'type', 'name', 'notes', 'fields', 'login_uri', 'login_username', 'login_password', 'login_totp']
        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()
        
        for cred in credentials:
            writer.writerow({
                'folder': cred.get('folder', ''),
                'favorite': '1' if cred.get('favorite', False) else '0',
                'type': 'login',
                'name': cred.get('name', ''),
                'notes': cred.get('notes', ''),
                'fields': '',
                'login_uri': cred.get('login_uri', ''),
                'login_username': cred.get('login_username', ''),
                'login_password': cred.get('login_password', ''),
                'login_totp': cred.get('login_totp', '')
            })
        
        csv_content = csv_buffer.getvalue()
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=bitwarden_import.csv"}
        )
    
    except Exception as e:
        return JSONResponse({"success": False, "message": str(e)}, status_code=400)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
