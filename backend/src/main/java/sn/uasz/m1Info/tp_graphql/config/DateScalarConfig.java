package sn.uasz.m1Info.tp_graphql.config;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import java.util.List;

@Configuration
public class DateScalarConfig {

    private static final List<DateTimeFormatter> ACCEPTED_FORMATS = List.of(
            DateTimeFormatter.ISO_LOCAL_DATE, // "2001-06-10"
            DateTimeFormatter.ofPattern("dd/MM/yyyy") // "10/06/2001"
    );

    @Bean
    public GraphQLScalarType dateScalar() {
        return GraphQLScalarType.newScalar()
                .name("Date")
                .description("Custom scalar for LocalDate")
                .coercing(new Coercing<LocalDate, String>() {
                    @Override
                    public String serialize(Object dataFetcherResult) {
                        if (dataFetcherResult instanceof LocalDate date) {
                            return date.format(DateTimeFormatter.ISO_LOCAL_DATE);
                        }
                        throw new CoercingSerializeException("Expected a LocalDate");
                    }

                    @Override
                    public LocalDate parseValue(Object input) {
                        String value = input.toString();
                        for (DateTimeFormatter formatter : ACCEPTED_FORMATS) {
                            try {
                                return LocalDate.parse(value, formatter);
                            } catch (DateTimeParseException ignored) {
                            }
                        }
                        throw new CoercingParseValueException("Invalid date format: " + value);
                    }

                    @Override
                    public LocalDate parseLiteral(Object input) {
                        if (input instanceof StringValue stringValue) {
                            return parseValue(stringValue.getValue());
                        }
                        throw new CoercingParseLiteralException("Expected a string literal");
                    }
                })
                .build();
    }

}
