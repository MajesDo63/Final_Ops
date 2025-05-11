import os
import subprocess

project_name = "dungeon-shelf"
pages = ["IndexPage", "CartPage", "AdminPage", "LoginPage", "RegisterPage"]

# Paso 1: Crear proyecto React
subprocess.run(["npx", "create-react-app", project_name])

# Paso 2: Crear carpetas de páginas y componentes
src_path = os.path.join(project_name, "src")
pages_path = os.path.join(src_path, "pages")
components_path = os.path.join(src_path, "components")

os.makedirs(pages_path, exist_ok=True)
os.makedirs(components_path, exist_ok=True)

# Paso 3: Crear archivos JSX con HTML embebido
html_files = {
    "IndexPage": "index.html",
    "CartPage": "cart.html",
    "AdminPage": "admin.html",
    "LoginPage": "login.html",
    "RegisterPage": "register.html"
}

for page, html_file in html_files.items():
    jsx_file = os.path.join(pages_path, f"{page}.jsx")
    with open(html_file, "r", encoding="utf-8") as html:
        content = html.read()
    with open(jsx_file, "w", encoding="utf-8") as jsx:
        jsx.write(f"""export default function {page}() {{
    return (
        <>
{content}
        </>
    );
}}
""")

# Paso 4: Copiar styles.css
subprocess.run(["cp", "styles.css", os.path.join(src_path, "styles.css")])

# Paso 5: Instalar htmltojsx
subprocess.run(["npm", "install", "htmltojsx"], cwd=project_name)

# Paso 6: Crear README
readme_content = """
# dungeon-shelf Frontend

## Cómo convertir HTML a JSX

Instala htmltojsx si no lo tienes:
npx htmltojsx archivo.html > archivo.jsx

Ejemplo para IndexPage:
npx htmltojsx src/pages/IndexPage.jsx > src/pages/IndexPage_fixed.jsx

## Cómo correr el proyecto

npm start
"""
with open(os.path.join(project_name, "README.md"), "w", encoding="utf-8") as readme:
    readme.write(readme_content)

print("✅ Proyecto React creado, HTML copiado, y htmltojsx instalado.")