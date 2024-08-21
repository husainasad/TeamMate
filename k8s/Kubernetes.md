# Kubernetes Setup for TaskManager Application
Containerization is a complicated process which becomes more complicated without automated tools like Kubernetes. This guide explains how to integrate the TaskManager application and Kubernetes. The application consists of three main components: PostgreSQL database, Django backend, and React frontend. The guide will help us in using Kubernetes to run the components as independent clusters. <br>

### Set up PostgreSQL Database Object
- Use the official PostgreSQL image to set up the database image.
- Use the 'postgres-deployment' and 'postgres-service' YAML files to specify Object configurations

### Set up Django Backend Object
- Use the 'backend.Docker' in the backend app folder to create the backend image with the command:`docker build -f backend.Dockerfile -t taskmanager-backend-image .`
- Create a configmap in kubernetes to pass local env variables to the Backend container at run time using command:`kubectl create configmap taskmanager-backend-env --from-env-file=.env -n taskmanager`
- Use the 'backend-deployment' and 'backend-service' YAML files to specify Object configurations

### Set up React Frontend Object
- Use the 'frontend.Docker' in the frontend app folder to create the frontend image with the command:: `docker build -f frontend.Dockerfile -t taskmanager-frontend-image .`<br>
- React Apps are served as static files and therefore do not use run time env variables. Use 'entrypoint.sh' to replace the variables in the build during runtime.
- Use the 'frontend-deployment' and 'frontend-service' YAML files to specify Object configurations

### Set up Ingress
We use Nodeport service type to expose the frontend service outside the cluster. However the frontend still needs to resolve the backend-service url which is not possible on browser (because the browser is outside the cluster).<br>
To solve this, we follow [this guide](https://kubernetes.github.io/ingress-nginx/deploy/) to create an Ingress Controller. <br>
- Create the Ingress Controller using command: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml`
- Verify using command: `kubectl get pods -n ingress-nginx`
- View Logs using command: `kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx`
- To Get the ingressclass (used in ingress-resource.yaml), use the command:`kubectl get ingressclass`
- The Controller can be deleted using command: `kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml`
- Use the 'ingress-resource' YAML files to specify Ingress Object configurations
- Verify using command: `kubectl get ingress -n taskmanager`

### Deployment
- Create a namespace using command: `kubectl create namespace taskmanager`
- Apply all Object configurations using command: `kubectl apply -f .`
- Verify using command: 
    - `kubectl get all -n taskmanager`
    - `kubectl get pods -n taskmanager`
- Stream logs using command: `kubectl logs -f <pod_name> -n taskmanager`
- using interactive shell inside the container using command: `kubectl exec -it <pod_name> -n taskmanager sh`
- Remove all Object configurations using command: `kubectl delete -f .`
- Delete namespace using command: `kubectl delete namespace taskmanager`
- Commands for database pod:
    - `psql -U postgres`
    - `\l`
    - `\c database name`
    - `\dt`