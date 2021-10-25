const config = { 
    // Production Settings
    // SERVER_MYPROFILE_HOSTNAME: 'myprofile.ganeshicmc.com',
    // SERVER_BLOG_HOSTNAME: 'blog.ganeshicmc.com',

    // Localhost Settings
    // SERVER_MYPROFILE_HOSTNAME: 'myprofile.localhost',
    // SERVER_BLOG_HOSTNAME: 'blog.localhost',
    
    // Inside Docker Settings
    SERVER_MYPROFILE_HOSTNAME: 'myprofile',
    SERVER_BLOG_HOSTNAME: 'blog',
    
    // Default Configs
    SERVER_PORT: 80,
    SERVER_BLOG_SUBDOMAINS: ['', 'vanloon', 'charles', 'guerra', 'mono', 'brandt', 'dorime', 'lu'],
    FLAG: 'Ganesh{S0_th4ts_th3_r3As9n_I_n33d_to_1e4rN_W3b_4nd_NeTw0rkS_Hmmm}'
}

module.exports = { config }