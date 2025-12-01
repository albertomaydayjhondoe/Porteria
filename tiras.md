---
layout: page
title: Todas las Tiras
permalink: /tiras/
---

# Archivo de Tiras

Explora todas las tiras cómicas organizadas por fecha.

{% assign tiras_by_year = site.tiras | group_by_exp: "tira", "tira.date | date: '%Y'" | sort: "name" | reverse %}

{% for year in tiras_by_year %}
  <h2>{{ year.name }}</h2>
  
  {% assign tiras_by_month = year.items | group_by_exp: "tira", "tira.date | date: '%m'" | sort: "name" | reverse %}
  
  {% for month in tiras_by_month %}
    {% assign month_name = month.name | plus: 0 %}
    {% assign month_names = "Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre" | split: "," %}
    <h3>{{ month_names[month_name] | minus: 1 }}</h3>
    
    <div class="tiras-grid">
      {% assign sorted_tiras = month.items | sort: 'date' | reverse %}
      {% for tira in sorted_tiras %}
        <div class="tira-card">
          {% if tira.image %}
            <div class="tira-thumbnail">
              <a href="{{ tira.url }}">
                <img src="{{ tira.image | relative_url }}" alt="{{ tira.title | escape }}">
              </a>
            </div>
          {% endif %}
          <div class="tira-info">
            <h4><a href="{{ tira.url }}">{{ tira.title }}</a></h4>
            <p class="tira-date">{{ tira.date | date: "%d de %B, %Y" }}</p>
            {% if tira.tags %}
              <div class="tira-tags">
                {% for tag in tira.tags %}
                  <span class="tag">#{{ tag }}</span>
                {% endfor %}
              </div>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </div>
  {% endfor %}
{% endfor %}

<style>
.tiras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.tira-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.tira-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tira-thumbnail img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.tira-info {
  padding: 1rem;
}

.tira-info h4 {
  margin: 0 0 0.5rem 0;
}

.tira-info h4 a {
  text-decoration: none;
  color: #333;
}

.tira-info h4 a:hover {
  color: #666;
}

.tira-date {
  color: #666;
  font-size: 0.9em;
  margin: 0 0 0.5rem 0;
}

.tira-tags .tag {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8em;
  margin-right: 5px;
}
</style>
