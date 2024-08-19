### Containerize the PostgreSQL Database
Use the official PostgreSQL image to set up the database container

### Build the Django Backend Image
The dockerfile for the application backend is present as 'backend.Docker' in the backend app folder.<br>
Create the image using the command: `docker build -f backend.Dockerfile --secret id=my_env,src=.env -t taskmanager-backend-image .`<br>

#### Build the React Frontend Image
The dockerfile for the application frontend is present as 'frontend.Docker' in the frontend app folder.<br>
Create the image using the command: `docker build -f frontend.Dockerfile -t taskmanager-frontend-image .`<br>

kubectl create namespace taskmanager [kubectl delete namespace taskmanager]
kubectl apply -f postgres-deployment.yaml [kubectl delete -f postgres-deployment.yaml]
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

kubectl apply -f .

kubectl get all -n taskmanager
kubectl get pods -n taskmanager
kubectl get deployments -n taskmanager
kubectl get services -n taskmanager

kubectl describe deployment taskmanager-backend -n taskmanager
kubectl describe deployment taskmanager-frontend -n taskmanager

kubectl logs taskmanager-backend -n taskmanager
kubectl logs taskmanager-frontend -n taskmanager

kubectl get endpoints backend-service -n taskmanager

kubectl exec -it taskmanager-frontend-b6d679557-gf5nl -n taskmanager sh