export const BO_AUTH_MODULE = [
    {
        "name": "SUPER_ADMIN",
        "permissions": {
            "BO_USER" : ["bo-user:list", "bo-user:create", "bo-user:update", "bo-user:delete"],
            "PROJECT" : ["project:list", "project:create", "project:update", "project:delete"],
            "SECTION" : ["section:list", "section:create", "section:update", "section:delete"],
            "PROJECT_POST" : ["project-post:list", "project-post:create", "project-post:update", "project-post:delete"],
            "PROJECT_IMAGE" : ["project-image:list", "project-image:create", "project-image:update", "project-image:delete"],
            "PROJECT_UTILITY" : ["project-utility:list", "project-utility:create", "project-utility:update", "project-utility:delete"],
            "FILE_LINK": ["file-link:create", "file-link:list"],
            "UTILITY" : ["utility:list", "utility:create", "utility:update", "utility:delete"],
            "TRANSACTION" : ["transaction:list", "transaction:create", "transaction:update", "transaction:delete"],
        },
    },
    {
        "name": "MOD",
        "permissions": {
            "BO_USER" : ["bo-user:list", "bo-user:create", "bo-user:update", "bo-user:delete"],
            "PROJECT" : ["project:list", "project:create", "project:update", "project:delete"],
            "SECTION" : ["section:list", "section:create", "section:update", "section:delete"],
            "PROJECT_IMAGE" : ["project-image:list", "project-image:create", "project-image:update", "project-image:delete"],
            "PROJECT_UTILITY" : ["project-utility:list", "project-utility:create", "project-utility:update", "project-utility:delete"],
            "FILE_LINK": ["file-link:create", "file-link:list"],
            "UTILITY" : ["utility:list", "utility:create", "utility:update", "utility:delete"],
            "TRANSACTION" : ["transaction:list", "transaction:create", "transaction:update", "transaction:delete"],
        },
    },
    {
        "name": "ADMIN",
        "permissions": {
            "BO_USER" : ["bo-user:list", "bo-user:create", "bo-user:update", "bo-user:delete"],
            "PROJECT" : ["project:list", "project:create", "project:update", "project:delete"],
            "SECTION" : ["section:list", "section:create", "section:update", "section:delete"],
            "PROJECT_POST" : ["project-post:list", "project-post:create", "project-post:update", "project-post:delete"],
            "PROJECT_IMAGE" : ["project-image:list", "project-image:create", "project-image:update", "project-image:delete"],
            "PROJECT_UTILITY" : ["project-utility:list", "project-utility:create", "project-utility:update", "project-utility:delete"],
            "FILE_LINK": ["file-link:create", "file-link:list"],
            "UTILITY" : ["utility:list", "utility:create", "utility:update", "utility:delete"],
            "TRANSACTION" : ["transaction:list", "transaction:create", "transaction:update", "transaction:delete"],
        },
    }
];