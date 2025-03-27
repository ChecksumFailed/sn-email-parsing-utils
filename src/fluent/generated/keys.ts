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
                    src_server_interfaces_GSLog_ts: {
                        table: 'sys_module'
                        id: 'dec2323a48e241fa9e4022be661c824b'
                    }
                    src_server_modules_ParsingUtils_ts: {
                        table: 'sys_module'
                        id: '9c3d6d7c87fe412dbd9a6e550454d4dd'
                    }
                }
            }
        }
    }
}
