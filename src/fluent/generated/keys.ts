import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'c794a1baafe642d6bcaf59af9ebf7b0f'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '7bc895cf787a40c3a9be860f0e1e33df'
                    }
                    src_server_modules_ParsingUtils_ts: {
                        table: 'sys_module'
                        id: '1dac07ccce7349318e5ae8cf7e2afd2d'
                    }
                }
                composite: [
                    {
                        table: 'sys_user_role'
                        id: '862158d98328e250e42ca230ceaad3f3'
                        key: {
                            name: 'x_257038_email_p_0.admin'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'ca2198d98328e250e42ca230ceaad303'
                        key: {
                            name: 'x_257038_email_p_0.user'
                        }
                    },
                ]
            }
        }
    }
}
