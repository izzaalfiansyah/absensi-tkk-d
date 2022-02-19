import { createClient } from '@supabase/supabase-js';

const supabase = {
    url: 'https://yrybthlkzjqoptrcpgoa.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTAxNzY1MywiZXhwIjoxOTU0NTkzNjUzfQ.e7kxMhE_Wf1RCbsHscDCQd48B41HGghmMMmGHPdB7rs',
};

const db = createClient(supabase.url, supabase.key);

export default db;
