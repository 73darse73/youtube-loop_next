import { createClient } from '@supabase/supabase-js';

// Supabaseの接続情報を環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 環境変数が設定されていない場合はエラーを表示
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabaseの環境変数が設定されていません。');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定');
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseKey); 