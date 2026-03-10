"""
dashboard.py
Plotly dashboard para visualizar los datos de precipitaciones almacenados en MySQL.

Gráficas incluidas
------------------
1. Precipitación promedio por departamento (barras horizontales).
2. Evolución temporal de la precipitación diaria (línea de tiempo).
3. Distribución de valores de precipitación (histograma).
4. Mapa de dispersión georreferenciado de las estaciones (scatter_geo).

Uso:
    python dashboard.py
    # Abre http://localhost:8050 en el navegador.
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

import config
import database


# ---------------------------------------------------------------------------
# Carga de datos
# ---------------------------------------------------------------------------

def load_data() -> pd.DataFrame:
    """Lee la tabla precipitaciones desde MySQL y la devuelve como DataFrame."""
    conn = database.get_connection()
    query = """
        SELECT codigo_estacion, nombre_estacion, departamento, municipio,
               fecha, valor_mm, latitud, longitud
        FROM precipitaciones
        WHERE valor_mm IS NOT NULL
        ORDER BY fecha
    """
    df = pd.read_sql(query, conn)
    conn.close()

    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
    df["valor_mm"] = pd.to_numeric(df["valor_mm"], errors="coerce")
    df["latitud"] = pd.to_numeric(df["latitud"], errors="coerce")
    df["longitud"] = pd.to_numeric(df["longitud"], errors="coerce")

    return df


# ---------------------------------------------------------------------------
# Figuras individuales
# ---------------------------------------------------------------------------

def fig_promedio_por_departamento(df: pd.DataFrame) -> go.Figure:
    """Barras horizontales: precipitación promedio (mm) por departamento."""
    agg = (
        df.groupby("departamento")["valor_mm"]
        .mean()
        .reset_index()
        .rename(columns={"valor_mm": "promedio_mm"})
        .sort_values("promedio_mm")
    )
    fig = px.bar(
        agg,
        x="promedio_mm",
        y="departamento",
        orientation="h",
        title="Precipitación promedio por departamento (mm)",
        labels={"promedio_mm": "Promedio (mm)", "departamento": "Departamento"},
        color="promedio_mm",
        color_continuous_scale="Blues",
    )
    fig.update_layout(coloraxis_showscale=False, yaxis_title="")
    return fig


def fig_serie_temporal(df: pd.DataFrame) -> go.Figure:
    """Línea de tiempo: precipitación diaria total."""
    serie = (
        df.groupby("fecha")["valor_mm"]
        .sum()
        .reset_index()
        .rename(columns={"valor_mm": "total_mm"})
    )
    fig = px.line(
        serie,
        x="fecha",
        y="total_mm",
        title="Precipitación total diaria (mm)",
        labels={"fecha": "Fecha", "total_mm": "Total (mm)"},
    )
    fig.update_traces(line_color="#1f77b4")
    return fig


def fig_histograma(df: pd.DataFrame) -> go.Figure:
    """Histograma de la distribución de valores de precipitación."""
    fig = px.histogram(
        df,
        x="valor_mm",
        nbins=50,
        title="Distribución de valores de precipitación (mm)",
        labels={"valor_mm": "Precipitación (mm)", "count": "Frecuencia"},
        color_discrete_sequence=["#1f77b4"],
    )
    return fig


def fig_mapa_estaciones(df: pd.DataFrame) -> go.Figure:
    """Mapa de dispersión georreferenciado de las estaciones."""
    estaciones = (
        df.dropna(subset=["latitud", "longitud"])
        .groupby(["codigo_estacion", "nombre_estacion", "departamento",
                  "municipio", "latitud", "longitud"], as_index=False)["valor_mm"]
        .mean()
        .rename(columns={"valor_mm": "promedio_mm"})
    )

    if estaciones.empty:
        return go.Figure().update_layout(title="Mapa de estaciones (sin coordenadas disponibles)")

    fig = px.scatter_geo(
        estaciones,
        lat="latitud",
        lon="longitud",
        hover_name="nombre_estacion",
        hover_data={"departamento": True, "municipio": True,
                    "promedio_mm": ":.2f", "latitud": False, "longitud": False},
        color="promedio_mm",
        color_continuous_scale="Blues",
        size="promedio_mm",
        size_max=20,
        title="Estaciones de medición – precipitación promedio (mm)",
        scope="south america",
    )
    fig.update_geos(fitbounds="locations", showcountries=True, countrycolor="gray")
    return fig


# ---------------------------------------------------------------------------
# Dashboard combinado
# ---------------------------------------------------------------------------

def build_dashboard(df: pd.DataFrame) -> go.Figure:
    """Crea un dashboard con las cuatro gráficas en una sola figura."""
    fig = make_subplots(
        rows=2,
        cols=2,
        subplot_titles=(
            "Promedio por departamento",
            "Serie temporal diaria",
            "Distribución de precipitación",
            "Mapa de estaciones",
        ),
        specs=[
            [{"type": "bar"},          {"type": "scatter"}],
            [{"type": "histogram"},    {"type": "scattergeo"}],
        ],
    )

    # 1 – Barras por departamento
    agg = (
        df.groupby("departamento")["valor_mm"]
        .mean()
        .reset_index()
        .sort_values("valor_mm")
    )
    fig.add_trace(
        go.Bar(x=agg["valor_mm"], y=agg["departamento"], orientation="h",
               marker_color="#1f77b4", name="Promedio"),
        row=1, col=1,
    )

    # 2 – Serie temporal
    serie = df.groupby("fecha")["valor_mm"].sum().reset_index()
    fig.add_trace(
        go.Scatter(x=serie["fecha"], y=serie["valor_mm"],
                   mode="lines", line_color="#1f77b4", name="Total diario"),
        row=1, col=2,
    )

    # 3 – Histograma
    fig.add_trace(
        go.Histogram(x=df["valor_mm"], nbinsx=50,
                     marker_color="#1f77b4", name="Distribución"),
        row=2, col=1,
    )

    # 4 – Mapa
    estaciones = (
        df.dropna(subset=["latitud", "longitud"])
        .groupby(["nombre_estacion", "latitud", "longitud"], as_index=False)["valor_mm"]
        .mean()
    )
    if not estaciones.empty:
        fig.add_trace(
            go.Scattergeo(
                lat=estaciones["latitud"],
                lon=estaciones["longitud"],
                text=estaciones["nombre_estacion"],
                mode="markers",
                marker=dict(
                    size=8,
                    color=estaciones["valor_mm"],
                    colorscale="Blues",
                    showscale=False,
                ),
                name="Estaciones",
            ),
            row=2, col=2,
        )

    fig.update_layout(
        title_text="Dashboard – Precipitaciones Colombia (datos.gov.co)",
        height=900,
        showlegend=False,
    )
    fig.update_geos(scope="south america", showcountries=True,
                    countrycolor="gray", fitbounds="locations")
    return fig


# ---------------------------------------------------------------------------
# Punto de entrada
# ---------------------------------------------------------------------------

def run():
    """Carga los datos, genera las figuras y abre el dashboard en el navegador."""
    print("Cargando datos desde MySQL …")
    df = load_data()
    print(f"  {len(df)} registros cargados.")

    if df.empty:
        print("No hay datos. Ejecuta extractor.py primero.")
        return

    dashboard = build_dashboard(df)
    dashboard.show()

    # También guardar figuras individuales como HTML
    fig_promedio_por_departamento(df).write_html("grafica_departamentos.html")
    fig_serie_temporal(df).write_html("grafica_serie_temporal.html")
    fig_histograma(df).write_html("grafica_histograma.html")
    fig_mapa_estaciones(df).write_html("grafica_mapa.html")
    print("Gráficas exportadas: grafica_*.html")


if __name__ == "__main__":
    run()
