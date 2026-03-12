erDiagram
    %% New Super Admin Tables
    CLIENTS {
        bigint id PK
        bigint uid UK
        string company_name
        string contact_person
        string email
        string phone
        string address
        string logo_path
        enum status "active|trial|suspended|cancelled"
        date trial_start_date
        date trial_end_date
        date subscription_start_date
        date subscription_end_date
        string timezone
        string locale
        json settings "Client-specific settings"
        bigint created_by FK
        bigint updated_by FK
        int update_key
        int del_flg
        datetime created_at
        datetime updated_at
    }

    CLIENT_ADMINS {
        bigint id PK
        bigint uid UK
        bigint client_uid FK
        bigint user_uid FK "References users.uid (client admin users)"
        boolean is_primary
        enum status "active|inactive"
        bigint created_by FK
        bigint updated_by FK
        int update_key
        int del_flg
        datetime created_at
        datetime updated_at
    }

    CLIENT_SUBSCRIPTIONS {
        bigint id PK
        bigint uid UK
        bigint client_uid FK
        string plan_name "Basic|Professional|Enterprise"
        enum billing_cycle "monthly|yearly"
        decimal amount
        date start_date
        date end_date
        enum status "active|cancelled|expired"
        bigint created_by FK
        bigint updated_by FK
        int update_key
        int del_flg
        datetime created_at
        datetime updated_at
    }

    CLIENT_USAGE_METERS {
        bigint id PK
        bigint uid UK
        bigint client_uid FK
        string meter_type "applicants|users|storage|api_calls"
        int current_usage
        int limit
        date reset_date
        datetime recorded_at
        datetime created_at
        datetime updated_at
    }

    BILLING_INVOICES {
        bigint id PK
        bigint uid UK
        bigint client_uid FK
        bigint subscription_uid FK
        string invoice_number UK
        date invoice_date
        date due_date
        decimal subtotal
        decimal tax
        decimal total
        string currency "LKR|JPY|USD"
        json line_items
        enum status "draft|sent|paid|overdue|cancelled"
        string pdf_path
        datetime paid_at
        bigint created_by FK
        bigint updated_by FK
        int update_key
        int del_flg
        datetime created_at
        datetime updated_at
    }

    BILLING_PAYMENTS {
        bigint id PK
        bigint uid UK
        bigint invoice_uid FK
        decimal amount
        date payment_date
        enum payment_method "credit_card|bank_transfer|cash|other"
        string transaction_id
        enum status "pending|completed|failed|refunded"
        json payment_details
        bigint created_by FK
        int update_key
        datetime created_at
        datetime updated_at
    }

    EMAIL_TEMPLATES {
        bigint id PK
        bigint uid UK
        string name
        string subject
        text body_html
        text body_text
        json variables "Available template variables"
        enum category "subscription|trial_ending|payment|system"
        enum status "active|inactive|draft"
        bigint created_by FK
        bigint updated_by FK
        int update_key
        int del_flg
        datetime created_at
        datetime updated_at
    }

    EMAIL_QUEUE {
        bigint id PK
        bigint uid UK
        bigint client_uid FK
        bigint template_uid FK
        string recipient_email
        json recipient_data
        json template_data
        datetime scheduled_at
        datetime sent_at
        enum status "pending|sent|failed|cancelled"
        int retry_count
        text error_message
        bigint created_by FK
        int update_key
        datetime created_at
        datetime updated_at
    }

    SYSTEM_ACTIVITY_LOG {
        bigint id PK
        bigint uid UK
        bigint client_uid FK "NULL for super admin actions"
        bigint user_uid FK "References users.uid"
        string action_type "create|update|delete|login|export|payment|etc"
        string entity_type "applicant|user|client|invoice|template"
        bigint entity_uid
        json old_values
        json new_values
        string ip_address
        string user_agent
        datetime created_at
    }

    SUPER_ADMIN_USERS {
        bigint id PK
        bigint uid UK
        bigint user_uid FK "References users.uid"
        enum role "super_admin|billing_admin|support_admin|viewer"
        json permissions "Granular super admin permissions"
        bigint created_by FK
        int update_key
        int del_flg
        datetime created_at
        datetime updated_at
    }

    %% Relationships to existing tables
    USERS ||--o{ CLIENT_ADMINS : "uid -> user_uid"
    USERS ||--o{ SUPER_ADMIN_USERS : "uid -> user_uid"
    
    %% New relationships
    CLIENTS ||--o{ CLIENT_ADMINS : "uid -> client_uid"
    CLIENTS ||--o{ CLIENT_SUBSCRIPTIONS : "uid -> client_uid"
    CLIENTS ||--o{ CLIENT_USAGE_METERS : "uid -> client_uid"
    CLIENTS ||--o{ BILLING_INVOICES : "uid -> client_uid"
    CLIENTS ||--o{ EMAIL_QUEUE : "uid -> client_uid"
    CLIENTS ||--o{ SYSTEM_ACTIVITY_LOG : "uid -> client_uid"
    
    CLIENT_SUBSCRIPTIONS ||--o{ BILLING_INVOICES : "uid -> subscription_uid"
    BILLING_INVOICES ||--o{ BILLING_PAYMENTS : "uid -> invoice_uid"
    
    EMAIL_TEMPLATES ||--o{ EMAIL_QUEUE : "uid -> template_uid"
    
    USERS ||--o{ SYSTEM_ACTIVITY_LOG : "uid -> user_uid"