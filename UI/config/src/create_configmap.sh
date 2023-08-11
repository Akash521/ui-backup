kubectl delete cm --all --kubeconfig /app/kube/kubeconfig

echo "Deleted previous configmaps"

source .env

sed -i -e s@rgs@$registry_server@g fr-camera.yaml drone-camera.yaml raven-camera.yaml raven-homeland.yaml voi-camera.yaml stevedore-camera.yaml poi-camera.yaml nonpoi-camera.yaml livestream-dep.yaml
sed -i -e s@cn@$client_name@g fr-camera.yaml drone-camera.yaml raven-camera.yaml raven-homeland.yaml voi-camera.yaml stevedore-camera.yaml poi-camera.yaml nonpoi-camera.yaml livestream-dep.yaml
sed -i -e s@tag@$build_id@g fr-camera.yaml drone-camera.yaml raven-camera.yaml raven-homeland.yaml voi-camera.yaml stevedore-camera.yaml poi-camera.yaml nonpoi-camera.yaml livestream-dep.yaml

wifi_ip=`grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' /app/kube/kubeconfig`
sed -i -e s@CLIENT_IP@$wifi_ip@g ./config.py
sed -i -e s@CLIENT_IP@$wifi_ip@g ./domain_name.js


kubectl create configmap backend-config --from-file=./config.py --kubeconfig /app/kube/kubeconfig

echo "Backend-configmap created"

kubectl create configmap frontend-config --from-file=./domain_name.js --kubeconfig /app/kube/kubeconfig

echo "Frontend configmap created"

kubectl create configmap raven-yaml --from-file=./raven-camera.yaml --kubeconfig /app/kube/kubeconfig

echo "raven-yaml created"

kubectl create configmap drone-yaml --from-file=./drone-camera.yaml --kubeconfig /app/kube/kubeconfig

echo "drone-yaml created"

kubectl create configmap fr-yaml --from-file=./fr-camera.yaml --kubeconfig /app/kube/kubeconfig

echo "fr-yaml created"

kubectl create configmap homeland-yaml --from-file=./raven-homeland.yaml --kubeconfig /app/kube/kubeconfig

echo "homeland-yaml created"

kubectl create configmap voi-yaml --from-file=./voi-camera.yaml --kubeconfig /app/kube/kubeconfig

echo "voi-yaml created"

kubectl create configmap download-yaml --from-file=./download.yaml --kubeconfig /app/kube/kubeconfig

echo "download-yaml created"

# kubectl create configmap stevedore-yaml --from-file=./stevedore-camera.yaml --kubeconfig /app/kube/kubeconfig

# echo "stevedore-yaml created"

kubectl create configmap poi-yaml --from-file=./poi-camera.yaml --kubeconfig /app/kube/kubeconfig

echo "poi-yaml created"

kubectl create configmap nonpoi-yaml --from-file=./nonpoi-camera.yaml --kubeconfig /app/kube/kubeconfig

echo "nonpoi-yaml created"

kubectl create configmap livestreamdep-yaml --from-file=./livestream-dep.yaml --kubeconfig /app/kube/kubeconfig

echo "livestreamdep-yaml created"

kubectl create configmap livestreamser-yaml --from-file=./livestream-ser.yaml --kubeconfig /app/kube/kubeconfig


echo "livestreamser.yaml created"

kubectl create configmap kubeconfig --from-file=/app/kube/kubeconfig --kubeconfig /app/kube/kubeconfig

echo "kubeconfig created"


delete_pod=(dal detectapi event-app frontend ravenhomeland ravenpoi ravenvoi vms-app)

for delete in "${delete_pod[@]}"

do

    pod=`kubectl get pod --kubeconfig /app/kube/kubeconfig | grep $delete |awk '{ print $1 }'`

    kubectl delete pod $pod --force --kubeconfig /app/kube/kubeconfig

    echo "$pod pod is deleted"

done
echo "Deleting shells"
rm -rf /bin/bash
rm -rf /bin/sh
echo "Deleted shells --> $?"


echo "All configmaps created"

ping 8.8.8.8 > /dev/null 
