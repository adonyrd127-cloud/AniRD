package com.example.anird.tv

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.lifecycleScope
import com.example.anird.R
import com.example.anird.data.repository.AuthRepository
import kotlinx.coroutines.launch

/**
 * Pantalla de inicio de sesión y registro para Android TV.
 * Adaptada para navegación por control remoto con D-pad y teclado virtual.
 */
class TvLoginActivity : FragmentActivity() {

    private lateinit var authRepo: AuthRepository
    private lateinit var etUsername: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var btnRegister: Button
    private lateinit var btnSkip: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.tv_activity_login)

        authRepo = TvRepositoryProvider.getAuthRepository(this)

        initViews()
        setupListeners()
    }

    private fun initViews() {
        etUsername = findViewById(R.id.et_username)
        etPassword = findViewById(R.id.et_password)
        btnLogin = findViewById(R.id.btn_login)
        btnRegister = findViewById(R.id.btn_register)
        btnSkip = findViewById(R.id.btn_skip)

        // Forzar foco inicial en el nombre de usuario
        etUsername.requestFocus()
    }

    private fun setupListeners() {
        btnLogin.setOnClickListener {
            val username = etUsername.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            lifecycleScope.launch {
                val result = authRepo.login(username, password)
                if (result.isSuccess) {
                    Toast.makeText(this@TvLoginActivity, getString(R.string.tv_login_success, username), Toast.LENGTH_SHORT).show()
                    navigateToMain(shouldRefresh = true)
                } else {
                    Toast.makeText(this@TvLoginActivity, result.exceptionOrNull()?.message ?: "Error de inicio de sesión", Toast.LENGTH_LONG).show()
                }
            }
        }

        btnRegister.setOnClickListener {
            val username = etUsername.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            lifecycleScope.launch {
                val result = authRepo.register(username, password)
                if (result.isSuccess) {
                    Toast.makeText(this@TvLoginActivity, getString(R.string.tv_login_success, username), Toast.LENGTH_SHORT).show()
                    navigateToMain(shouldRefresh = true)
                } else {
                    Toast.makeText(this@TvLoginActivity, result.exceptionOrNull()?.message ?: "Error al registrarse", Toast.LENGTH_LONG).show()
                }
            }
        }

        btnSkip.setOnClickListener {
            navigateToMain(shouldRefresh = false)
        }
    }

    private fun navigateToMain(shouldRefresh: Boolean) {
        val intent = Intent(this, TvMainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("should_refresh", shouldRefresh)
        }
        startActivity(intent)
        finish()
    }
}
