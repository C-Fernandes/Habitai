package com.imd.habitai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI habitaiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HabitAI API")
                        .version("1.0.0")
                        .description("""
                                API oficial do Habitai — Sistema para gerenciamento de dados, rotinas e interações da aplicação.
                                
                                Esta documentação contém:
                                • Endpoints públicos e privados  
                                • Estrutura de requisições e respostas  
                                • Modelos utilizados pela aplicação  
                                • Informações gerais sobre autenticação e fluxo da API  
                                """));
    }
}
