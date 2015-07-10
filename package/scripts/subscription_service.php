<?php

    require "aps/2/runtime.php";    

    /**
    * @type("http://myweatherdemo.com/databinding1/subscription_service/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */
    
    class company extends \APS\ResourceBase
    
    {

        /**
         * @link("http://myweatherdemo.com/databinding1/application/1.0")
         * @required
         */
        public $application;
        
        /**
         * @link("http://aps-standard.org/types/core/account/1.0")
         * @required
         */
        public $account;
        
        /**
         * @type(string)
         * @title("Company identifier in MyWeatherDemo")
         */
        public $company_id;

        /**
         * @type(string)
         * @title("Login to MyWeatherDemo interface")
         */
        public $username;

        /**
         * @type(string)
         * @title("Password for MyWeatherDemo user")
         */
        public $password;
        
        /**
         * @type(string)
         * @title("Company Name")
         */
        public $company_name;

        const BASE_URL = "http://www.myweatherdemo.com/api/company/";
        
        public function provision(){

            $this->company_name = $this->account->companyName;
            
            $request = array(
                    'country' => $this->account->addressPostal->countryName,
                    'city' => $this->account->addressPostal->locality,
                    'name' => $this->company_name
            );
            
            $response = $this->send_curl_request('POST', self::BASE_URL, $request);

            $this->company_id = $response->{'id'};
            $this->username = $response->{'username'};
            $this->password = $response->{'password'};

        }

        public function unprovision(){

            $url = self::BASE_URL . $this->company_id;
            $response = $this->send_curl_request('DELETE', $url);
        }

        // unprovision() method is executed when resource is changed (PUT)
        public function configure($new){

            // need to pass company_id to indicate which company we want to delete
            $url = self::BASE_URL . $this->company_id;

            // $new contains new values that will be saved in APS controller after configure() exits
            // you can access old values using $this
            $request = array(
                    'name' => $new->company_name,
                    'username' => $new->username,
                    'password' => $new->password
            );
            $response = $this->send_curl_request('PUT', $url, $request);

        }

        private function send_curl_request($verb, $url, $payload = ''){

            $token = $this->application->provider_token;

            $headers = array(
                    'Content-type: application/json',
                    'x-provider-token: '. $token
            );

            $ch = curl_init();
            
            curl_setopt_array($ch, array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_CUSTOMREQUEST => $verb,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($payload)
            ));
            
            $response = json_decode(curl_exec($ch));
            
            curl_close($ch);

            return $response;
        }
    }
?>
