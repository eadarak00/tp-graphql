package sn.uasz.m1Info.tp_graphql.config;

import graphql.schema.GraphQLScalarType;
import graphql.schema.idl.RuntimeWiring;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

@Configuration
public class GraphQlConfig {

    private final GraphQLScalarType dateScalar;

    public GraphQlConfig(GraphQLScalarType dateScalar) {
        this.dateScalar = dateScalar;
    }

    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return builder -> builder.scalar(dateScalar);
    }
}
