//app/config/index.ts
const ENV = {
    dev: {
      apiUrl: 'http://localhost:8081/api', 
    },
    prod: {
      apiUrl: 'https://your-production-api.com/api', // Change this to production API URL
    },
  };
  
  export default __DEV__ ? ENV.dev : ENV.prod;