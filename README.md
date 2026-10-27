# IT Asset Management System — DevOps Lab Case Study

A small web application for registering, viewing, updating, and deleting IT assets. It is deliberately lightweight so it can be used for the 12-week DevOps laboratory exercises.

## Features
- Register an asset with name, type, serial number, assigned team/person, and status.
- View the inventory.
- Update and delete assets.
- REST API: `GET /api/assets`, `POST /api/assets`, `PUT /api/assets/:id`, `DELETE /api/assets/:id`.
- Health endpoint: `GET /health`.

**Prototype limitation:** records are stored in memory, not a database. They reset when the app restarts. For a production case study, replace the in-memory array with MySQL/PostgreSQL/MongoDB and add authentication/authorization.

## Requirements
Install Node.js and npm. For Docker/Kubernetes weeks, install Docker Desktop and enable Kubernetes, or use Minikube. For Selenium, install Google Chrome and a compatible ChromeDriver (Selenium Manager can often manage the driver automatically).

## Run locally
```bash
npm install
npm start
```
Open `http://localhost:3000`. Health check: `http://localhost:3000/health`.

## Week 1 — Build the asset registration application
1. Create this project folder and files.
2. Run `npm install` and `npm start`.
3. Register an asset in the browser.
4. Check `GET http://localhost:3000/api/assets` using a browser or curl:
```bash
curl http://localhost:3000/api/assets
curl -X POST http://localhost:3000/api/assets -H "Content-Type: application/json" -d "{\"name\":\"Test Laptop\",\"type\":\"Laptop\",\"serialNumber\":\"LT-3001\",\"assignedTo\":\"IT Team\",\"status\":\"Available\"}"
```
Expected: the POST request returns HTTP `201 Created` and the new asset JSON.

## Week 2 — Git and GitHub commands
```bash
git init
git status
git add .
git commit -m "Initial IT asset management application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/it-asset-management-system.git
git push -u origin main
```
Create the empty GitHub repository first. Replace the URL with your repository URL. Do not commit secrets or passwords.

## Week 3 — Source code management
```bash
git checkout -b feature/asset-validation
# Make a small code change, then:
git diff
git add .
git commit -m "Add asset validation"
git push -u origin feature/asset-validation
```
On GitHub, open a Pull Request and merge it into `main`. To inspect history: `git log --oneline --graph --all`.

## Week 4 — Install and explore Jenkins
1. Install Java (Jenkins-supported JDK) and Jenkins using the official instructions for your OS.
2. Start Jenkins and open `http://localhost:8080`.
3. Unlock Jenkins using the initial admin password shown in Jenkins' setup instructions.
4. Install suggested plugins, including Pipeline and Git.
5. Configure a Pipeline job. Connect the GitHub repository and select `Jenkinsfile` from SCM.
6. A local Jenkins agent needs Docker installed and permission to run Docker commands for the Docker build stage.

## Week 5 — Continuous Integration using Jenkins
The included `Jenkinsfile` checks out the repo, installs dependencies, checks JavaScript syntax, and builds the Docker image.
1. Push the `Jenkinsfile` to GitHub.
2. In Jenkins, create **New Item → Pipeline**.
3. Select **Pipeline script from SCM → Git**, enter repository URL, and set script path to `Jenkinsfile`.
4. Click **Build Now** and inspect Console Output.
5. If Docker is unavailable on the Jenkins agent, temporarily remove the `Build Docker image` stage or configure Docker access on that agent.

## Week 6 — Docker commands
From the project root:
```bash
docker --version
docker build -t it-asset-management:1.0 .
docker images
docker run --name itam-container -p 3000:3000 -d it-asset-management:1.0
docker ps
docker logs itam-container
docker stop itam-container
docker rm itam-container
```
Open `http://localhost:3000`. If port 3000 is already in use, use `-p 3001:3000` and open port 3001.

## Week 7 — Containerize the application
The included `Dockerfile` builds a small Node.js image. Rebuild and test:
```bash
docker build -t it-asset-management:1.0 .
docker run --rm -p 3000:3000 it-asset-management:1.0
```
In a second terminal:
```bash
curl http://localhost:3000/health
```
Expected output: `{"status":"ok"}`.

## Week 8 — Integrate Docker and Kubernetes
1. Install/enable Kubernetes in Docker Desktop, or install Minikube and kubectl.
2. Verify:
```bash
kubectl version --client
kubectl get nodes
```
3. Build the image locally: `docker build -t it-asset-management:latest .`
4. With Minikube, make the image available to its Docker environment using `minikube image load it-asset-management:latest`. With Docker Desktop Kubernetes, the locally built image is usually available directly.
5. Kubernetes clusters on other machines need the image pushed to a registry and the YAML image field changed to that registry image.

## Week 9 — Deploy on Kubernetes
From the project root:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl get deployments
kubectl get pods
kubectl get services
kubectl rollout status deployment/it-asset-management
```
Open `http://localhost:30080` when using Docker Desktop Kubernetes. With Minikube, run:
```bash
minikube service it-asset-management-service
```
Useful troubleshooting:
```bash
kubectl describe pod POD_NAME
kubectl logs deployment/it-asset-management
kubectl delete -f k8s/deployment.yaml
```
Replace `POD_NAME` with an actual pod name from `kubectl get pods`.

## Week 10 — Install and explore Selenium
Selenium is used to automate browser testing. Install dependencies:
```bash
npm install
```
Install Chrome. Run the app in one terminal with `npm start`; in another terminal run a simple Selenium script or the tests in Week 11/12. If Chrome cannot launch, check Chrome installation and Selenium/driver compatibility.

## Week 11 — JavaScript program and Selenium test
The application itself is written in JavaScript. With the server running:
```bash
npm test
```
The included Selenium test opens the UI, checks the heading, registers a test asset, and checks the inventory count. The test uses `http://localhost:3000` by default. To test a different URL, set `BASE_URL` before running tests, for example:
```bash
# macOS/Linux
BASE_URL=http://localhost:3000 npm test
# Windows PowerShell
$env:BASE_URL="http://localhost:3000"; npm test
```

## Week 12 — Test cases for the application
Suggested manual/API test cases:
| ID | Test | Expected result |
|---|---|---|
| TC01 | Open home page | Application heading and form appear |
| TC02 | Register valid asset | Asset is added to inventory |
| TC03 | Submit with missing name/type/serial | Browser required-field validation blocks submission |
| TC04 | Register duplicate serial number | API returns `409` with duplicate serial message |
| TC05 | Edit an existing asset | Updated values appear in inventory |
| TC06 | Delete an existing asset | Asset disappears from inventory |
| TC07 | Update unknown ID | API returns `404` |
| TC08 | Delete unknown ID | API returns `404` |
| TC09 | Open `/health` | JSON status is `ok` |
| TC10 | Refresh the page | Current in-memory inventory is displayed |
| TC11 | Stop and restart server | Demo data resets (known prototype limitation) |
| TC12 | Run Selenium suite | Browser checks pass when app and Chrome are available |

Example API checks:
```bash
# Get inventory
curl -i http://localhost:3000/api/assets

# Missing required field: expect 400
curl -i -X POST http://localhost:3000/api/assets -H "Content-Type: application/json" -d "{\"name\":\"\",\"type\":\"Laptop\",\"serialNumber\":\"LT-X\"}"

# Duplicate serial: expect 409 after a matching asset exists
curl -i -X POST http://localhost:3000/api/assets -H "Content-Type: application/json" -d "{\"name\":\"Duplicate\",\"type\":\"Laptop\",\"serialNumber\":\"LT-1001\"}"

# Unknown ID: expect 404
curl -i -X DELETE http://localhost:3000/api/assets/99999
```

## What to demonstrate in your lab record
For each week, include: aim, software/tools required, procedure, commands/code, output screenshot, result, and conclusion. Take screenshots of the running app, Git history/GitHub repository, Jenkins successful build, Docker image/container, Kubernetes pods/service, and Selenium test results.

## Case-study summary
The system centralizes basic IT asset inventory management. The DevOps workflow versions source code with Git/GitHub, runs a Jenkins CI pipeline, packages the app with Docker, deploys it using Kubernetes, and validates the UI with Selenium. This is an educational prototype, not a production asset system.
