package ru.hh.school.adaptation;

import static java.util.Collections.singletonMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import ru.hh.nab.core.CoreProdConfig;
import ru.hh.nab.hibernate.HibernateProdConfig;
import ru.hh.nab.hibernate.datasource.DataSourceType;
import ru.hh.nab.hibernate.datasource.RoutingDataSource;

import javax.sql.DataSource;

@Configuration
@Import({CoreProdConfig.class, HibernateProdConfig.class})
public class ProdConfig {

  @Bean
  String serviceName() {
    return "adaptation";
  }

  @Bean
  ExampleResource exampleResource() {
    return new ExampleResource();
  }

  @Bean
  DataSource dataSource(EmbeddedDatabase masterDatabase, EmbeddedDatabase replicaDatabase) {
    RoutingDataSource routingDataSource = new RoutingDataSource();
    routingDataSource.setDefaultTargetDataSource(masterDatabase);
    routingDataSource.setTargetDataSources(singletonMap(DataSourceType.REPLICA, replicaDatabase));
    return routingDataSource;
  }

  @Bean(destroyMethod = "shutdown")
  static EmbeddedDatabase masterDatabase() {
    return createEmbeddedDatabase(DataSourceType.DEFAULT);
  }

  @Bean(destroyMethod = "shutdown")
  static EmbeddedDatabase replicaDatabase() {
    return createEmbeddedDatabase(DataSourceType.REPLICA);
  }

  private static EmbeddedDatabase createEmbeddedDatabase(DataSourceType dataSourceType) {
    return new EmbeddedDatabaseBuilder()
        .setName(dataSourceType.getId())
        .setType(EmbeddedDatabaseType.HSQL)
        .build();
  }
}
