package com.ajou.capstonedesign.museapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }
    public void btn_register(View view){//회원가입 하는 페이지로 넘어가기
        Intent intent = new Intent(this,Register_Activity.class);
        startActivity(intent);
    }

    public void btn_login(View view){//페이지로 넘어가기
        Intent intent = new Intent(this,MainActivity.class);
        startActivity(intent);
    }
}
