## Digital Ocean

#### [New SSH Key](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/create-with-putty/)
* Install `PuTTY` and `PuTTYgen`
* PuTTYgen: 
    ** Generate
    ** Key passphrase
    ** Save private key

#### [Add key to Digital Ocean](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/to-account/)
* Account/Security/Add SSH Key

#### [How to Connect to Droplets with SSH](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/)
To log in to your Droplet with SSH, you need three pieces of information:
    * The Droplet’s IP address
    * The default username on the server (root)
    * The default password for that username, if you aren’t using SSH keys()

##### 1. [Connect with OpenSSH](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/openssh/)

##### 2. [Connect to your Droplet with PuTTY on Windows](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/putty/)
PuTTY config:
    * Session - Host Name --> `root`
    * Connection/SSH/Auth --> browse private-key.ppk
    * Connection/Data - Auto-login username --> droplet IP address
