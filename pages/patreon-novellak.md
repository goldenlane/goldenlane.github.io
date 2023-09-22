---
layout: page
title: Patreon novellák
permalink: /patreon-novellak
description: Patreon exkluzív novellák listája.
---

Exkluzív tartalom a Patreon előfizetőknek.

{% assign novels=site.patreonNovels | sort: "date" | reverse %}

<ul class = "list-inline">
{% for s in novels %}
  <li>
  <hr>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-10"><h2 class="h2">{{s.title}}</h2></div>
      <div class="col-xs-12 col-sm-2"><span><i>{{s.date | date: "%Y-%m-%d"}}</i></span></div>
    </div>
    <div class="row">
    <div class="col-xs-12 col-sm-10">{{s.content}}</div>
    <div class="col-xs-12 col-sm-2"><a href="{{s.link}}" class="btn btn-primary">Olvasás</a></div>
    </div>
  </div>
  </li>
{% endfor %}
</ul>
