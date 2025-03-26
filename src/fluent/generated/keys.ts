import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    package_json: {
                        table: 'sys_module'
                        id: '7bc895cf787a40c3a9be860f0e1e33df'
                    }
                }
            }
        }
    }
}
