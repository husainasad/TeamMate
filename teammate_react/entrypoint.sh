#!/bin/sh
sed -i "s|__REACT_APP_API_URL__|${BACKEND_URL}|g" /app/build/static/js/*.js
npx serve -s build