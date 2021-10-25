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
}

module.exports = { config }