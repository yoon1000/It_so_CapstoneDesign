package com.ajou.capstonedesign.museapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;

import org.w3c.dom.Text;

public class Register_Activity extends AppCompatActivity {

    EditText et_password, et_passwordConfirm;
    ImageView setImage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_);

        et_password = (EditText)findViewById(R.id.et_password);
        et_passwordConfirm = (EditText)findViewById((R.id.et_passwordConfirm));
        setImage = (ImageView)findViewById(R.id.setImage);

        et_passwordConfirm.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(et_password.getText().toString().equals(et_passwordConfirm.getText().toString())){
                    setImage.setImageResource(R.drawable.check);
                }
                else{
                    setImage.setImageResource(R.drawable.redmark);
                }

            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }
    public void btnRegister(View view){//회원가입 후 로그인기 페이지로 넘어가
        Intent intent = new Intent(this,LoginActivity.class);
        startActivity(intent);
    }
}
